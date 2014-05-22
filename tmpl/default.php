<?php
/**
* @package    _mygmap
* @author     Swen Gleisner
* @copyright  Copyright (C) 2014
* @license    GNU/GPL
**/

//no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

echo '<div id="gmap_maincontainer" ng-app="mygmapApp">';
echo '<div id="mytreeform" class="row-fluid">';
echo '<div class="navbar navbar-inverse" ng-controller="initController">';
echo '<span class="pull-left mybrand" href="#">{{myBrand}} {{myObjectname}}</span>';
echo '<div class="navbar-inner">';
echo '<button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">';
echo '<span class="icon-bar"></span>';
echo '<span class="icon-bar"></span>';
echo '<span class="icon-bar"></span>';
echo '</button>';
echo '<div class="nav-collapse collapse">';
echo '<ul class="nav pull-right">';
echo '<li class="active"><a href="#/index">Kontrollzentrum</a></li>';  
echo '<li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown">Location-Manager<b class="caret"></b></a>';
echo '<ul class="dropdown-menu">';
echo '<li><a href="#/locationmanagerAllLocation">Location-Directory</a></li>';
echo '<li><a href="#/locationmanagerNewLocation">Location hinzufügen</a></li>';
echo '</ul>';
echo '</li>';
echo '<li><a href="#/servicemanager">Service-Manager</a></li>';
echo '</ul>';
echo '</div>';
echo '</div>';
echo '</div>';
echo '</div>';   
echo '<div ng-view class="row-fluid"></div>';
echo '</div>';

echo $myHTML;
?>