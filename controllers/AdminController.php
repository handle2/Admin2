<?php
namespace Modules\Admin\Controllers;

use Modules\BusinessLogic\ContentSettings;
use Modules\BusinessLogic\Search\ProfileSearch;

class AdminController extends ControllerBase
{
    

    public function initialize()
    {
        
    }
    
    public function indexAction(){
       
    }

    public function logoutAction(){
        $hash = $this->session->get("hash");
        $login = ContentSettings\Login::getLogin($hash);
        $this->session->remove("hash");
        $login->delete();
        return $this->api(200,'success');
    }
    

    public function enterAction(){


        $form = $this->request->getJsonRawBody(true);

        $profileSearch = ProfileSearch::createProfileSearch();
        $profileSearch->lang = $this->lang;
        $profileSearch->password = $form['password'];
        $profileSearch->username = $form['username'];
        /** @var ContentSettings\Profile $profile */
        $profile = $profileSearch->findFirst();
        if($profile){
            $this->cookies->set('hash',md5($profile->username),time()+3600*24*7); //1 week
            $this->session->set("hash",md5($profile->username));
            if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
                $ip = $_SERVER['HTTP_CLIENT_IP'];
            } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
            } else {
                $ip = $_SERVER['REMOTE_ADDR'];
            }
            $login = ContentSettings\Login::createLogin(array('hash' => md5($profile->username),'ip'=>$ip,'id'=>$profile->id));
            return $this->api(200,($login));
        }

        return $this->api(404,'username_or_password_fail');
    }
}