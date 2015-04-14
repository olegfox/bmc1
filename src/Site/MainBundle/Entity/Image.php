<?php

namespace Site\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Site\MainBundle\Entity\Image
 *
 * @ORM\Table(name="images")
 * @ORM\Entity
 */
class Image
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="text")
     */
    private $name;

    /**
     * @ORM\Column(type="text")
     */
    private $mimeType;

    /**
     * @ORM\Column(type="text")
     */
    private $src;

    /**
     * @ORM\ManyToOne(targetEntity="Catalog", inversedBy="images")
     * @ORM\JoinColumn(name="id_catalog",  referencedColumnName="id")
     */
    private $catalog;

    /**
     * @ORM\ManyToOne(targetEntity="Portfolio", inversedBy="images")
     * @ORM\JoinColumn(name="id_portfolio",  referencedColumnName="id")
     */
    private $portfolio;

    /**
     * @ORM\ManyToOne(targetEntity="Factory", inversedBy="images")
     * @ORM\JoinColumn(name="id_factory",  referencedColumnName="id")
     */
    private $factory;

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
     * @return Image
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
     * Set mimeType
     *
     * @param string $mimeType
     * @return Image
     */
    public function setMimeType($mimeType)
    {
        $this->mimeType = $mimeType;

        return $this;
    }

    /**
     * Get mimeType
     *
     * @return string 
     */
    public function getMimeType()
    {
        return $this->mimeType;
    }

    /**
     * Set src
     *
     * @param string $src
     * @return Image
     */
    public function setSrc($src)
    {
        $this->src = $src;

        return $this;
    }

    /**
     * Get src
     *
     * @return string 
     */
    public function getSrc()
    {
        return $this->src;
    }

    /**
     * Set catalog
     *
     * @param \Site\MainBundle\Entity\Catalog $catalog
     * @return Image
     */
    public function setCatalog(\Site\MainBundle\Entity\Catalog $catalog = null)
    {
        $this->catalog = $catalog;

        return $this;
    }

    /**
     * Get catalog
     *
     * @return \Site\MainBundle\Entity\Catalog 
     */
    public function getCatalog()
    {
        return $this->catalog;
    }

    /**
     * Set portfolio
     *
     * @param \Site\MainBundle\Entity\Portfolio $portfolio
     * @return Image
     */
    public function setPortfolio(\Site\MainBundle\Entity\Portfolio $portfolio = null)
    {
        $this->portfolio = $portfolio;

        return $this;
    }

    /**
     * Get portfolio
     *
     * @return \Site\MainBundle\Entity\Portfolio 
     */
    public function getPortfolio()
    {
        return $this->portfolio;
    }

    /**
     * Set factory
     *
     * @param \Site\MainBundle\Entity\Factory $factory
     * @return Image
     */
    public function setFactory(\Site\MainBundle\Entity\Factory $factory = null)
    {
        $this->factory = $factory;

        return $this;
    }

    /**
     * Get factory
     *
     * @return \Site\MainBundle\Entity\Factory 
     */
    public function getFactory()
    {
        return $this->factory;
    }
}
