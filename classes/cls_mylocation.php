<?php
class myLocation
{
	private static $instance;
	private static $error = array();
	
	private function __construct()
	{
		;
	}
	
	public static function getInstance()
	{
		if ( is_null( self::$instance ) )
	{
		self::$instance = new self();
	}
		return self::$instance;
	}


	
	public static function insertLocation($jsonData) {
		//Decode JsonData and extract the Arrays into seperate Vars, after that delete the Arrays in Decoded-Json-Data
		$data = json_decode($jsonData);
		
		$locationcategories = $data->locationcategories;
		$locationcontact = $data->locationcontact;
		$locationservice = $data->locationservice;
		$locationopentime = $data->locationopentime;
		$locationemptytime = $data->locationemptytime;
		
		unset($data->locationcategories);
		unset($data->locationcontact);
		unset($data->locationservice);
		unset($data->locationopentime);
		unset($data->locationemptytime);
		
		$locationid = self::helperLocationData($data,'insert');
		//return $locationid;
		if($locationid == false) {
			return "Die Location konnte nicht eingetragen werden";
		} else {
			//Insert Categories
			for($i = 0; $i < sizeof($locationcategories);$i++) {
				self::helperLocationCategoriesData($locationcategories[$i], $locationid, 'insert');	
			}			
			//Insert Contacts
			for($i = 0; $i < sizeof($locationcontact);$i++) {
				self::helperContactData($locationcontact[$i], $locationid, 'insert');	
			}
			
		}
		if(sizeof($error) > 0) {
			return $error;
		}	
		return $locationid;
	}

	private static function helperLocationData($data,$action) {
		$db = JFactory::getDbo();
		$query = $db->getQuery(true);	
		
		$columns = array();
		$values = array();
		
		if($action == 'insert'){
			//prepare longitude and latitude float for Decimal
			if(is_float($data->longitude) && is_float($data->latitude)) {
				$data->longitude = number_format( $data->longitude, 9); 
				$data->latitude = number_format( $data->latitude, 8);
			}
			
			foreach ($data as $key => $value) {
				if($value != NULL) {
					$columns[] = $key;
					if(is_string($value)) {
						$values[] = $db->quote($value);
					}else{
						$values[] = $value;
					}
				}
			}
			$query
				->insert($db->quoteName('_mygmap_location'))
				->columns($db->quoteName($columns))
				->values(implode(',', $values));
			// Get the query using
			$db->setQuery($query);
			$result = $db->query();
			$lastid = $db->insertid();
			if(!$result) {
				return $result;
			} else {		
				//Insert Into LocationContact
				return $lastid;
			}
		}
	}

	private static function helperContactData($data,$locationid,$action) {
		$db = JFactory::getDbo();
		$query = $db->getQuery(true);	
		
		$columns = array();
		$values = array();
		
		if($action == 'insert'){
			foreach ($data as $key => $value) {
				if($value != NULL) {
					$columns[] = $key;
					if(is_string($value)) {
						$values[] = $db->quote($value);
					}else{
						$values[] = $value;
					}
				}
			}
			$query
				->insert($db->quoteName('_mygmap_contact'))
				->columns($db->quoteName($columns))
				->values(implode(',', $values));
			// Get the query using
			$db->setQuery($query);
			$result = $db->query();
			$lastid = $db->insertid();
	
			if(!$result) {
				self::$error[] = $data;
				return false;
			} else {
				$query = $db->getQuery(true);
				$locationcontactcolumns = array('fid_location','fid_contact');
				$locationcontactvalues = array($locationid,$lastid);
				$query
					->insert($db->quoteName('_mygmap_locationcontact'))
					->columns($db->quoteName($locationcontactcolumns))
					->values(implode(',', $locationcontactvalues));		
				$db->setQuery($query);
				$result = $db->query();
				if(!$result) {
					self::$error[] = $data;
				}
				return $result;
			}
		}
	}
	
	private static function helperLocationCategoriesData($data,$locationid,$action) {
		$db = JFactory::getDbo();
		$query = $db->getQuery(true);	
		
		if($action == 'insert'){
			$columns = array('fid_location','fid_category');
			$values = array($locationid,$data);
			$query
				->insert($db->quoteName('_mygmap_locationcategory'))
				->columns($db->quoteName($columns))
				->values(implode(',', $values));
			// Get the query using
			$db->setQuery($query);
			$result = $db->query();
			$lastid = $db->insertid();
	
			if(!$result) {
				self::$error[] = $data;
				return false;
			} else {
				return $result;
			}
		}
	}
			
	public static function updateLocation($jsonData) {
		$data = json_decode($jsonData);
		$db = JFactory::getDbo();
		$query = $db->getQuery(true);

		$fields = array();
		$conditions = array();
		foreach ($data as $key => $value) {
			if($value != NULL && $key != 'pid_service') {
				$columns[] = $key;
				if(is_string($value)) {
					$fields[] = $db->quoteName($key) . ' = ' . $db->quote($value);
				}else{
					$fields[] = $db->quoteName($key) . ' = ' . $value;
				}
			}
			if($key == 'pid_service') {
				$conditions[] = $db->quoteName('pid_service') . ' = ' . $value;
			}
		}

		 
		$query->update($db->quoteName('_mygmap_service'))->set($fields)->where($conditions);	 
		$db->setQuery($query);		 
		$result = $db->query();
		return $result;	
	}

	public static function deleteLocation($jsonData) {
		$data = json_decode($jsonData);
		// Get a db connection.
		$db = JFactory::getDbo();
		$query = $db->getQuery(true);
		 
		// delete
		$conditions = array();
		foreach ($data as $key => $value) {
			if($key == 'pid_service') {
				$conditions[] = $db->quoteName('pid_service') . ' = ' . $value;
			}
		}
				 
		$query->delete($db->quoteName('_mygmap_service'));
		$query->where($conditions);
		 
		$db->setQuery($query);
		$result = $db->query();
		return $result;	
	}
}
?>




