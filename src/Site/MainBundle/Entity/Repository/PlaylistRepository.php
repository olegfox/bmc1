<?php

namespace Site\MainBundle\Entity\Repository;

use Doctrine\ORM\EntityRepository;

class PlaylistRepository extends EntityRepository
{
    public function getJson(){
        $audio = array();
        $playlists = $this->findAll();

        $i = 0;

        foreach($playlists as $playlist){
            $audio[$i] = array(
                'name' => $playlist->getName(),
                'selected' => 0,
                'seeking' => 0,
                'numberTrack' => 0,
                'countTracks' => count($playlist->getTracks())
            );
            foreach($playlist->getTracks() as $track){
                $audio[$i]['audio'][] = array(
                    'name' => $track->getName(),
                    'file' => '/' . $track->getFile()
                );
            }
            $i++;
        }

        return $audio;
    }
}
