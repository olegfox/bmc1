<?php

namespace Site\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class AudioController extends Controller
{

    public function indexAction()
    {

        $params = array(
        );
        return $this->render('SiteMainBundle:Audio:index.html.twig', $params);
    }

    public function jsonAction()
    {
//        $repository = $this->getDoctrine()->getRepository('SiteMainBundle:Playlist');
//        $audio = $repository->getJson();

        return new Response(file_get_contents('music/playlist.json'));
    }
}
