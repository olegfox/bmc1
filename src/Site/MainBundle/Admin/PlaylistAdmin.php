<?php
/**
 * Created by PhpStorm.
 * User: oleg
 * Date: 07.01.14
 * Time: 13:17
 */

namespace Site\MainBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Validator\ErrorElement;

class PlaylistAdmin extends Admin
{
    // Fields to be shown on create/edit forms
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('name', 'text', array('label' => 'Название радио'))
            ->add('tracks', 'sonata_type_collection',
                array(
                    'required' => false,
                    'by_reference' => false,
                    'label' => 'Музыкальные треки',
                    'btn_add' => false
                ),
                array(
                    'edit' => 'inline',
                    'inline' => 'table',
                    'allow_delete' => true,
                    'targetEntity' => 'Site\MainBundle\Entity\Audio'
                )
            )
            ->add('audio', 'file', array(
                'data_class' => null,
                'required' => false,
                'attr' => array(
                    'class' => 'uploadify',
                    'multiple' => true
                ),
                'label' => ' ',
            ));
    }

    // Fields to be shown on lists
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('name', 'text', array('label' => 'Название радио'));
    }

    public function validate(ErrorElement $errorElement, $object)
    {
        $errorElement
            ->with('name')
            ->assertNotNull(array())
            ->assertNotBlank()
            ->end();
    }
} 