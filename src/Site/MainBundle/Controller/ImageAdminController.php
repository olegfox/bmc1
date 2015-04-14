<?php
namespace Site\MainBundle\Controller;

use Sonata\AdminBundle\Controller\CRUDController as Controller;

class ImageAdminController extends Controller
{
    public function deleteAction($id = NULL)
    {
        $id     = $this->get('request')->get($this->admin->getIdParameter());
        $object = $this->admin->getObject($id);

        if (!$object) {
            throw new NotFoundHttpException(sprintf('unable to find the object with id : %s', $id));
        }

        if (false === $this->admin->isGranted('DELETE', $object)) {
            throw new AccessDeniedException();
        }

        if ($this->getRestMethod() == 'DELETE') {
            unlink($object->getSrc());
        }
        //return parent::deleteAction($id);
    }
}