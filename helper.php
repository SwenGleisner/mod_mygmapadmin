<?php
/**
* @package    _mygmap
* @author     Swen Gleisner
* @copyright  Copyright (C) 2014
* @license    GNU/GPL
**/

//no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
JLoader::register('myLocation',dirname ( __FILE__ ) . "/classes/cls_mylocation.php");
JLoader::register('myService',dirname ( __FILE__ ) . "/classes/cls_myservice.php");
//require_once (dirname ( __FILE__ ) . "/classes/cls_mycategory.php");


//extraClass in helper.php which normally comes with one Helper Class for Requests depends on _mygmap Module-Name and Joomla Ajax Request Naming
//Convention
//This class is only for Ajax Requests
class modmygmapadminHelper
{
	public static function getAjax() {
		
		//get the Json-Data from Ajax-Request
		$data = file_get_contents("php://input");
		//Decode Data	
		$objData = json_decode($data);
		
		//If objData cmd is set its a guilty DB-Request - a Result is delivered by the asked Instance
		//the result will be delivered as Json
		if(isset($objData->cmd)) {
			if($objData->cmd == 'strSelectAllServiceCategory') {
				$row = myService::getInstance()->selectAllServiceCategory();
				$serviceCategoryList = array();
				foreach($row as $r){
					$serviceCategoryList[] = array('pid_servicecategory'=>$r['pid_servicecategory'],
												   'categoryname'=>$r['categoryname']);
				}
				return new JResponseJson($serviceCategoryList);				
			}

			if($objData->cmd == 'strInsertService') {
				$insertedpid = myService::getInstance()->insertService($objData->data);
				return new JResponseJson($insertedpid);
			}

			if($objData->cmd == 'strUpdateService') {
				$result = myService::getInstance()->updateService($objData->data);
				return new JResponseJson($result);				
			}

			if($objData->cmd == 'strDeleteService') {
				$result = myService::getInstance()->deleteService($objData->data);
				return new JResponseJson($result);				
			}
						
			if($objData->cmd == 'strSelectAllService') {
				$row = myService::getInstance()->selectAllService();
				$allServices = array();
				foreach($row as $r){
					$allServices[] = array('pid_servicecategory'=>$r['pid_servicecategory'],
										   'categoryname'=>$r['categoryname'],
										   'pid_service'=>$r['pid_service'],
										   'fid_category'=>$r['fid_category'],
										   'servicename'=>$r['servicename'],
										   'customergroup'=>$r['customergroup'],
										  );
				}
				return new JResponseJson($allServices);				
			}			
			
						
			if($objData->cmd == 'strInsertLocation') {
				$insertedpid = myLocation::getInstance()->insertLocation($objData->data);
				return new JResponseJson($insertedpid);
			}	
		}	
	}
}

class mod_mygmapadminHelper
{
	public function getHTML()
	{		

		
		$strResult = "" ;

		return $strResult;
	}
}
?>