<?php

namespace Site\MainBundle\Entity\Repository;

use Doctrine\ORM\EntityRepository;

class PortfolioRepository extends EntityRepository
{
    public function getRandom(){
        $portfolio = $this->findAll();

        $ids = array();
        $i = 0;
        foreach ($portfolio[0]->getImages() as $image) {
            $ids[$i] = $image->getId();
            $i++;
        }
        shuffle($ids);

        $imagesPortfolio = array();
        $i = 0;
        foreach($ids as $id){
            foreach ($portfolio[0]->getImages() as $image) {
                if($id == $image->getId()){
                    $imagesPortfolio[$i]['id'] = $image->getId();
                    $imagesPortfolio[$i]['photo'] = $image->getSrc();
                    $imagesPortfolio[$i]['description'] = '';
                    $i++;
                }
            }

        }

        return $imagesPortfolio;
    }
}
