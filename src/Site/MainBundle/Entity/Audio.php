<?php

namespace Site\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Site\MainBundle\Entity\Audio
 *
 * @ORM\Table(name="audio")
 * @ORM\Entity
 */
class Audio {

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
     * @ORM\Column(type="text", nullable = true)
     */
    private $linkItunes = "";

    /**
     * @ORM\Column(type="text", nullable = true)
     */
    private $linkGooglePlay = "";

    /**
     * @ORM\Column(type="text", nullable = true)
     */
    private $file = "";

    /**
     * @ORM\ManyToOne(targetEntity="Playlist", inversedBy="tracks")
     * @ORM\JoinColumn(name="id_playlist",  referencedColumnName="id")
     */
    private $playlist;


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
     * @return Audio
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
     * Set file
     *
     * @param string $file
     * @return Audio
     */
    public function setFile($file)
    {
        $this->file = $file;

        return $this;
    }

    /**
     * Get file
     *
     * @return string 
     */
    public function getFile()
    {
        return $this->file;
    }

    /**
     * Set playlist
     *
     * @param \Site\MainBundle\Entity\Playlist $playlist
     * @return Audio
     */
    public function setPlaylist(\Site\MainBundle\Entity\Playlist $playlist = null)
    {
        $this->playlist = $playlist;

        return $this;
    }

    /**
     * Get playlist
     *
     * @return \Site\MainBundle\Entity\Playlist 
     */
    public function getPlaylist()
    {
        return $this->playlist;
    }

    /**
     * Set linkItunes
     *
     * @param string $linkItunes
     * @return Audio
     */
    public function setLinkItunes($linkItunes)
    {
        $this->linkItunes = $linkItunes;

        return $this;
    }

    /**
     * Get linkItunes
     *
     * @return string 
     */
    public function getLinkItunes()
    {
        return $this->linkItunes;
    }

    /**
     * Set linkGooglePlay
     *
     * @param string $linkGooglePlay
     * @return Audio
     */
    public function setLinkGooglePlay($linkGooglePlay)
    {
        $this->linkGooglePlay = $linkGooglePlay;

        return $this;
    }

    /**
     * Get linkGooglePlay
     *
     * @return string 
     */
    public function getLinkGooglePlay()
    {
        return $this->linkGooglePlay;
    }
}
