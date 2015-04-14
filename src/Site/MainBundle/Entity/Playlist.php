<?php

namespace Site\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Site\MainBundle\Entity\Playlist
 *
 * @ORM\Table(name="playlist")
 * @ORM\Entity(repositoryClass="Site\MainBundle\Entity\Repository\PlaylistRepository")
 */
class Playlist {

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="text", nullable = true)
     */
    private $name = "";

    /**
     * @ORM\OneToMany(targetEntity="Audio", cascade={"persist", "remove"}, mappedBy="playlist", orphanRemoval=true)
     */
    private $tracks;
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->tracks = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Playlist
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Add tracks
     *
     * @param \Site\MainBundle\Entity\Audio $tracks
     * @return Playlist
     */
    public function addTrack(\Site\MainBundle\Entity\Audio $tracks)
    {
        $this->tracks[] = $tracks;

        return $this;
    }

    /**
     * Remove tracks
     *
     * @param \Site\MainBundle\Entity\Audio $tracks
     */
    public function removeTrack(\Site\MainBundle\Entity\Audio $tracks)
    {
        $this->tracks->removeElement($tracks);
    }

    /**
     * Get tracks
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getTracks()
    {
        return $this->tracks;
    }

    public function getAudio()
    {
        return $this->tracks;
    }

    public function setAudio()
    {
        return $this;
    }

}
