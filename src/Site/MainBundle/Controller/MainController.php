<?php

namespace Site\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
include_once("Mobile_Detect.php");

class MainController extends Controller
{

    public function indexAction()
    {
        $repository_news = $this->getDoctrine()
            ->getRepository('SiteMainBundle:Page');
        $pages = $repository_news->findAll();
        $repository_catalog = $this->getDoctrine()
            ->getRepository('SiteMainBundle:Catalog');
        $catalog = $repository_catalog->findAll();
        $repository_portfolio = $this->getDoctrine()
            ->getRepository('SiteMainBundle:Portfolio');
        $imagesPortfolio = $repository_portfolio->getRandom();

        $repository_factory = $this->getDoctrine()
            ->getRepository('SiteMainBundle:Factory');
        $factory = $repository_factory->findAll();

        $imagesCatalog = array();
        $i = 0;
        foreach ($catalog as $cat) {
            $imagesCatalog[$i]['id'] = $cat->getId();
            $img = $cat->getImages();
            $imagesCatalog[$i]['photo'] = $img[0]->getSrc();
            $imagesCatalog[$i]['desciption'] = urlencode($cat->getDescription());
            $i++;
        }

        $mobile = 0;
        $smart = 0;
        $tablet = 0;
        $Mobile_Detect = new Mobile_Detect();
        if($Mobile_Detect->isTablet() || $Mobile_Detect->isMobile()){
            $mobile = 1;
        }
        if($Mobile_Detect->isTablet()){
            $tablet = 1;
        }
        $params = array(
            "pages" => $pages,
            "catalog" => $catalog,
            "factory" => $factory,
            'portfolio' => $imagesPortfolio,
            "imagesPortfolio" => json_encode($imagesPortfolio),
            "imagesCatalog" => json_encode($imagesCatalog),
            "mobile" => $mobile,
            "tablet" => $tablet
        );
        return $this->render('SiteMainBundle:Main:index.html.twig', $params);
    }

    public function pageAction($slug){
        $repository_page = $this->getDoctrine()
            ->getRepository('SiteMainBundle:Page');
        $page = $repository_page->findOneBy(array("slug" => $slug));
        $params = array(
            "page" => $page,
            "slug" => $slug
        );
        return $this->render('SiteMainBundle:Main:page.html.twig', $params);
    }

    public function scanerAction(){
        $audio = array();
        $directory = 'music';
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($directory));
        $i = -1;

//      Функция, которая полсчитывает количетсво файлов
        $countFiles = function ($dir){
            $count = 0;
            if ($handle = opendir($dir)) {
                while (($file = readdir($handle)) !== false){
                    if (!in_array($file, array('.', '..')) && !is_dir($dir.$file))
                        if(substr(pathinfo($file)['filename'], 0, 1) != '.'){
                            $count++;
                        }
                }
            }

            return $count;
        };

        $iterator->rewind();
        while($iterator->valid()) {
            if (!$iterator->isDot()) {

//              Флаг существования плейлиста
                $fl = 0;

//              Проверяем есть ли такой плейлист
                if(count($audio) > 0){
                    foreach($audio as $a){
                        if($a['name'] == $iterator->getSubPath()){
                            $fl = 1;
                            break;
                        }
                    }
                }

//              Если такого плейлиста нет, то добавляем его
                if($fl == 0){
                    if($iterator->getSubPath() != ''){

                        $count_files = $countFiles('music/' . $iterator->getSubPath());

                        if($count_files > 0){
                            $i++;
                            $audio[$i] = array(
                                'name' => $iterator->getSubPath(),
                                'selected' => 0,
                                'seeking' => 0,
                                'numberTrack' => 0,
                                'countTracks' => $countFiles('music/' . $iterator->getSubPath())
                            );
                        }

                    }
                }

                $pathinfo = pathinfo($iterator->key());

//              Добавляем музыку в плейлист
                if(substr($pathinfo['filename'], 0, 1) != '.' && $pathinfo['filename'] != 'playlist'){
                    $audio[$i]['audio'][] = array(
                        'name' => $pathinfo['filename'],
                        'linkGooglePlay' => 'https://play.google.com/store/search?q=' . $pathinfo['filename'],
                        'linkItunes' => 'http://itunes.com/search',
                        'file' => '/' . $iterator->key()
                    );
                }

            }

            $iterator->next();
        }

        file_put_contents('music/playlist.json', json_encode($audio, TRUE));
        return new Response(json_encode($audio, TRUE), 200);
    }
}
