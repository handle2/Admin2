<?php
/**
 * Created by PhpStorm.
 * User: Krisz
 * Date: 2016.11.24.
 * Time: 15:33
 */

namespace Modules\Admin\Controllers;
use Modules\BusinessLogic\ContentSettings;
use Modules\BusinessLogic\Search\RoleSearch;

class RoleController extends ControllerBase
{

    public function listAction(){
        $search = RoleSearch::createRoleSearch();

        $search->lang = $this->lang;
        
        if($this->authUser->role != 'admin'){
            $search->roles = $this->authUser->availableRoles;
        }

        $search->cacheByLogin($this->urlMakeup($this->authUser->username));
        $roles = $search->find();
        if($roles){
            return $this->api(200,$roles);
        }else{
            return $this->api(404,false);
        }
    }

    public function getAction($id = false){
        $search = RoleSearch::createRoleSearch();

        $search->lang = $this->lang;
        
        $id = (int)$id!=0?(int)$id:false;
        if($id){
            $role = $search->create($id);
        }else{
            $role = false;
        }

        if($role){
            return $this->api(200,$role);
        }
        return $this->api(200,false);
    }

    public function saveAction(){
        $search = RoleSearch::createRoleSearch();
        $form = $this->request->getJsonRawBody();
        /**@var \Modules\BusinessLogic\ContentSettings\Role $role*/
        $role = $form->id?$search->create($form->id):$search->create();
        $role->code = $form->code?$form->code:$this->urlMakeup($form->name);
        $role->name = $form->name;
        $role->rights = $form->rights;
        $role->roles = $form->roles;
        $role->langs = $form->langs;
        $role->save();
        return $this->api(200,$role);
    }

    public function deleteAction(){
        $id = $this->request->getJsonRawBody();
        $search = RoleSearch::createRoleSearch();
        /** @var ContentSettings\Role $role */
        $role = $search->create($id);
        $role->delete();

        return $this->api(200,"törölve");
    }

    public function uploadAction(){}
    public function editAction(){}
    public function indexAction(){}


}