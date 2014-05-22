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
			
			if($objData->cmd == 'strUpdateLocation') {
				//$insertedpid = myLocation::getInstance()->insertLocation($objData->data);
				$updatelocationresult = myLocation::getInstance()->updateLocation($objData->data);
				return new JResponseJson($updatelocationresult);
			}

			if($objData->cmd == 'strSelectAllLocation') {
				$row = myLocation::getInstance()->selectAllLocation();
				$allLocation = array();
				foreach($row as $r){
					$rowcat = myLocation::getInstance()->selectThisLocationCategory($r['pid_location']);
					$thisLocationCategories = array();
					foreach($rowcat as $rcat){	 	 
						$thisLocationCategories[] = array('pid_locationcategory'=>$rcat['pid_locationcategory'],
														  'fid_location'=>$rcat['fid_location'],
														  'fid_category'=>$rcat['fid_category'],
														  );
					}	
					$rowcon = myLocation::getInstance()->selectThisLocationContact($r['pid_location']);
					$thisLocationContact = array();
					foreach($rowcon as $rcon){	 	 
						$thisLocationContact[] = array('pid_contact'=>$rcon['pid_contact'],
													   'title'=>$rcon['title'],
													   'firstname'=>$rcon['firstname'],
													   'surname'=>$rcon['surname'],
													   'countrycode'=>$rcon['countrycode'],
													   'areacode'=>$rcon['areacode'],
													   'phonenumber'=>$rcon['phonenumber'],
													   'callthrough'=>$rcon['callthrough'],
													   'email'=>$rcon['email'],
													   'pid_locationcontact'=>$rcon['pid_locationcontact'],
													   'fid_location'=>$rcon['fid_location'],
													   'fid_contact'=>$rcon['fid_contact']
													  );
					}
					$rowopt = myLocation::getInstance()->selectThisLocationTimetable($r['pid_location'],1);
					$thisLocationOpentime = array();
					foreach($rowopt as $ropt){	 										 	 
						$thisLocationOpentime[] = array('pid_timetable'=>$ropt['pid_timetable'],
													   'fid_category'=>$ropt['fid_category'],
													   'fid_location'=>$ropt['fid_location'],
													   'pid_time'=>$ropt['pid_time'],
													   'day'=>$ropt['day'],
													   'from'=>$ropt['from'],
													   'to'=>$ropt['to'],
													   'fid_timetable'=>$ropt['fid_timetable'],
													  );
					}
					$rowemt = myLocation::getInstance()->selectThisLocationTimetable($r['pid_location'],2);
					$thisLocationEmptytime = array();
					foreach($rowemt as $remt){	 										 	 
						$thisLocationEmptytime[] = array('pid_timetable'=>$remt['pid_timetable'],
													   'fid_category'=>$remt['fid_category'],
													   'fid_location'=>$remt['fid_location'],
													   'pid_time'=>$remt['pid_time'],
													   'day'=>$remt['day'],
													   'from'=>$remt['from'],
													   'to'=>$remt['to'],
													   'fid_timetable'=>$remt['fid_timetable'],
													  );
					}
					$rowsrv = myLocation::getInstance()->selectThisLocationService($r['pid_location']);
					$thisLocationService = array();
					foreach($rowsrv as $rsrv){										  										 	 
						$thisLocationService[] = array('pid_locationservice'=>$rsrv['pid_locationservice'],
													   'fid_location'=>$rsrv['fid_location'],
													   'fid_service'=>$rsrv['fid_service'],
													   'pid_service'=>$rsrv['pid_service'],
													   'fid_category'=>$rsrv['fid_category'],
													   'servicename'=>$rsrv['servicename'],
													   'customergroup'=>$rsrv['customergroup'],
													   'pid_servicecategory'=>$rsrv['pid_servicecategory'],
													   'categoryname'=>$rsrv['categoryname'],
													  );
					}															 					 				 	 	 	 	 	 	 	 
					$allLocation[] = array('pid_location'=>$r['pid_location'],
										   'locationname'=>$r['locationname'],
										   'latitude'=>$r['latitude'],
										   'longitude'=>$r['longitude'],
										   'additiontoaddress'=>$r['additiontoaddress'],
										   'street'=>$r['street'],
										   'housenr'=>$r['housenr'],
										   'zipcode'=>$r['zipcode'],
										   'locality'=>$r['locality'],
										   'categories'=>$thisLocationCategories,
										   'contacts'=>$thisLocationContact,
										   'opentimes'=>$thisLocationOpentime,
										   'emptytimes'=>$thisLocationEmptytime,
										   'services'=>$thisLocationService
										  );										
				}
				return new JResponseJson($allLocation);				
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