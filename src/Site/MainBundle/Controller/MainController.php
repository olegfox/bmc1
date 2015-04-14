<?php

namespace Site\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
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
        $portfolio = $repository_portfolio->findBy(array(), array('id' => 'ASC'));
        $repository_factory = $this->getDoctrine()
            ->getRepository('SiteMainBundle:Factory');
        $factory = $repository_factory->findAll();

        $imagesPortfolio = array();
        $i = 0;
        foreach ($portfolio[0]->getImages() as $image) {
            $imagesPortfolio[$i]['id'] = $image->getId();
            $imagesPortfolio[$i]['photo'] = $image->getSrc();
            $imagesPortfolio[$i]['desciption'] = '';
            $i++;
        }

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
            "portfolio" => $portfolio,
            "factory" => $factory,
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
}
