<?php
class myService
{
	private static $instance;
	
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
	
	public static function selectAllServiceCategory() {
		// Get a db connection.
		$db = JFactory::getDbo();
		// Create a new query object.
		$query = $db->getQuery(true);
		 
		$query
			->select($db->quoteName(array('a.pid_servicecategory','a.categoryname')))
			->from($db->quoteName('_mygmap_servicecategory', 'a'))
			->order($db->quoteName('pid_servicecategory') . ' ASC');
		 
		// Get the query using
		$db->setQuery($query);
		$row = $db->loadAssocList();
		return $row;
	}

	public static function insertService($jsonData) {
		$data = json_decode($jsonData);
		$db = JFactory::getDbo();
		// Create a new query object.
		$query = $db->getQuery(true);	
		
		$columns = array();
		$values = array();
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
			->insert($db->quoteName('_mygmap_service'))
			->columns($db->quoteName($columns))
			->values(implode(',', $values));
		// Get the query using
		$db->setQuery($query);
		$db->query();
		$lastid = $db->insertid();
		return $lastid;	
	}

	public static function updateService($jsonData) {
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

	public static function deleteService($jsonData) {
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
			
	public static function selectAllService() {
		// Get a db connection.
		$db = JFactory::getDbo();
		// Create a new query object.
		$query = $db->getQuery(true);
		 
		$query
			->select($db->quoteName(array('a.pid_servicecategory','a.categoryname','b.pid_service','b.fid_category','b.servicename','b.customergroup')))
			->from($db->quoteName('_mygmap_servicecategory', 'a'))
			->join('INNER', $db->quoteName('_mygmap_service', 'b') . ' ON (' . $db->quoteName('a.pid_servicecategory') . ' = ' . $db->quoteName('b.fid_category') . ')')
			->order($db->quoteName('pid_servicecategory') . ' ASC');
		 
		// Get the query using
		$db->setQuery($query);
		$row = $db->loadAssocList();
		return $row;
	}
}
?>