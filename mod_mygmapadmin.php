<?php
/**
* @package    _mygmap
* @author     Swen Gleisner
* @copyright  Copyright (C) 2014
* @license    GNU/GPL
**/

//no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
require_once (dirname ( __FILE__ ) . "/helper.php");

JHtml::_('jquery.framework');
$doc = JFactory::getDocument();
$doc->addStyleSheet('modules/mod_mygmapadmin/css/basic.css');
$doc->addStyleSheet('modules/mod_mygmapadmin/css/bootstrap-timepicker.min.css');

$doc->addScript("modules/mod_mygmapadmin/lib/angular/angular.js");
$doc->addScript("modules/mod_mygmapadmin/lib/angular/angular-route.js");
$doc->addScript("modules/mod_mygmapadmin/lib/angular/angular-sanitize.js");
$doc->addScript("modules/mod_mygmapadmin/lib/angular/angular-perfect-scrollbar.js");
$doc->addScript("modules/mod_mygmapadmin/lib/angular/i18n/angular-locale_de-de.js");
$doc->addScript("modules/mod_mygmapadmin/js/app.js");
$doc->addScript("modules/mod_mygmapadmin/js/services.js");
$doc->addScript("modules/mod_mygmapadmin/js/controllers.js");
$doc->addScript("modules/mod_mygmapadmin/js/filters.js");
$doc->addScript("modules/mod_mygmapadmin/js/directives.js");

$doc->addScript("modules/mod_mygmapadmin/js/controller_locationmanager_alllocation.js");
$doc->addScript("modules/mod_mygmapadmin/js/controller_locationmanager_newlocation.js");
$doc->addScript("modules/mod_mygmapadmin/js/contoller_servicemanager.js");

$doc->addScript("modules/mod_mygmapadmin/js/directive_locationdetail.js");
$doc->addScript("modules/mod_mygmapadmin/js/directive_geodata.js");
$doc->addScript("modules/mod_mygmapadmin/js/directive_contact.js");
$doc->addScript("modules/mod_mygmapadmin/js/directive_service.js");
$doc->addScript("modules/mod_mygmapadmin/js/directive_timetable.js");

$doc->addScript("modules/mod_mygmapadmin/js/service_locationupdatefilter.js");
$doc->addScript("modules/mod_mygmapadmin/js/service_objectvaluecompare.js");

$doc->addScript("modules/mod_mygmapadmin/lib/bootstrap-timepicker.min.js");
$doc->addScript("https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false");

$myHTML = mod_mygmapadminHelper::getHTML( $params );

require(JModuleHelper::getLayoutPath( 'mod_mygmapadmin' ));
?>