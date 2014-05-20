var CategoryTools = {
	myActualCategoryObject: null,
	myDeleteCategoryPID: null,
	myLocationCategoryArray: null,
	myTreeBuilder: function(node) {
		var mytree = '';
		
		if(node['children'].length != 0) {
			mytree += '<li class="dd-item dd3-item" data-id="' + node['pid_category'] + '" data-parentcat="' + node['fid_parentcategory'] + '" data-categoryname="' + node['categoryname'] + '">';
			mytree += '<div class="dd-handle dd3-handle btn-primary"><i class="icon-resize-vertical icon-white"></i></div>';
			mytree += '<div class="dd3-content">' + node['categoryname'] + '<button class="btn btn-mini btn-danger pull-right deletecategory" type="button">löschen</button></div>';
			mytree += '<ol class="dd-list">';
			for(var i=0; i<node['children'].length ; i++) {
				mytree += CategoryTools.myTreeBuilder(node['children'][i]);	
			}
			mytree += '</ol>';		
		} 
		if(node['children'].length == 0) {
			mytree += '<li class="dd-item dd3-item" data-id="' + node['pid_category'] + '" data-parentcat="' + node['fid_parentcategory'] + '" data-categoryname="' + node['categoryname'] + '">';
			mytree += '<div class="dd-handle dd3-handle btn-primary"><i class="icon-resize-vertical icon-white"></i></div>';
			mytree += '<div class="dd3-content">' + node['categoryname'] + '<button class="btn btn-mini btn-danger pull-right deletecategory" type="button">löschen</button></div>';
			mytree += '</li>\n';
		}
		return mytree;
	},
	clickAddCategory: function(CategoryService,myActualCategoryObject) {
		CategoryTools.myActualCategoryObject = myActualCategoryObject;
		var categoryname = jQuery('#inputlocationbezeichnung').val().trim();
		if(categoryname.length > 0) {
			var insertCategoryPromise = CategoryService.insertCategory(categoryname,CategoryTools.myActualCategoryObject);
			insertCategoryPromise.then(function(arrResult) {
				mytree = '';
				mytree += '<li class="dd-item dd3-item" data-id="' + arrResult.data.data +'" data-parentcat="0" data-categoryname="' + categoryname +'">';
				mytree += '<div class="dd-handle dd3-handle btn-primary"><i class="icon-resize-vertical icon-white"></i></div>';
				mytree += '<div class="dd3-content">' + categoryname +'<button class="btn btn-mini btn-danger pull-right deletecategory" type="button">löschen</button></div>';
				mytree += '</li>\n';
				jQuery('#mytree').append(mytree);
			}, function(error) {
				alert('Error: ' + error);
			});
		}
	},
    clickDeleteCategory: function(CategoryService,myActualCategoryObject) {
		var deleteCategoryPromise = CategoryService.deleteCategory(CategoryTools.myDeleteCategoryPID,myActualCategoryObject.myActualCategoryObject);
		deleteCategoryPromise.then(function(arrResult) {
			jQuery('#deletemodalbody').children().remove();
			jQuery('#deletemodalbody').append('<p>Die Kategorie/en wurden gelöscht!</p>');
		}, function(error) {
			alert('Error: ' + error);
		});
	},
	clickNewCategoryObject: function(myLocationTreesArr,myCategoryObjectsheader,CategoryService,myActualCategoryObject,pid_categoryobject, objectname) {
		jQuery('#mytree').children().remove();
		CategoryTools.myActualCategoryObject = pid_categoryobject;
		myActualCategoryObject.myActualCategoryObject = pid_categoryobject;
		var promise = CategoryService.getCategory(pid_categoryobject);
		promise.then(function(arrResult) {
			myCategoryObjectsheader = [{ "name" : objectname }];
			myLocationTreesArr  = arrResult.data.data;
			
			var mytree = jQuery('<ol class="dd-list" data-id="0"></ol>');

			for(var i=0;i<myLocationTreesArr.length;i++) {
				if(myLocationTreesArr[i]['fid_parentcategory'] == 0)
				{
					mytree.append(CategoryTools.myTreeBuilder(myLocationTreesArr[i]));
				}
			}
			jQuery('#mytree').append(mytree);
			jQuery('#mytree').nestable();
			jQuery('.deletecategory').click(CategoryTools.addDeleteCategoryClick(this));					
			jQuery('#mytree').on('change', function() {
				CategoryTools.updateCategoryTree(CategoryService,myActualCategoryObject,this);
			});
		}, function(error) {
			alert('Error: ' + error);
		});
	},
	addDeleteCategoryClick: function() {
			jQuery('.deletecategory').click( function() {
					CategoryTools.myDeleteCategoryPID = jQuery(this).parent().parent().attr('data-id');
					var categoryname = jQuery(this).parent().parent().attr('data-categoryname')
					jQuery('#delcatname').children().remove();
					jQuery('#delcatname').append('<b>'+ categoryname +'</b>');
					jQuery('#myModal').modal('show');
			});
	},
	updateCategoryTree: function(CategoryService,myActualCategoryObject,updobject) {
		jQuery('.dd3-item').each(function() {
				if(jQuery(this).parent('ol').attr('data-id') == 0) {
					var myparentid = jQuery(this).parent('ol').attr('data-id');
					if(jQuery(this).attr('data-parentcat') != myparentid) {
						jQuery(this).attr('data-parentcat', myparentid);
						var mycategoryname = jQuery(this).attr('data-categoryname');
						var mycategoryid = jQuery(this).attr('data-id');
						var myparentcategory = jQuery(this).attr('data-parentcat');
						var mycategoryobject = CategoryTools.myActualCategoryObject;
						var updateCategoryPromise = CategoryService.updateCategory(mycategoryid,mycategoryname,myparentcategory,mycategoryobject);
						updateCategoryPromise.then(function(arrResult) 
							{
								console.log(jQuery(this).attr('data-categoryname'))
							}, function(error) {
								alert('Error: ' + error);
							});
					}
					jQuery(this).attr('data-parentcat', myparentid);
				} else {
					var myparentid = jQuery(this).parent('ol').parent('li').attr('data-id');
					if(jQuery(this).attr('data-parentcat') != myparentid) {
						jQuery(this).attr('data-parentcat', myparentid);
						var mycategoryname = jQuery(this).attr('data-categoryname');
						var mycategoryid = jQuery(this).attr('data-id');
						var myparentcategory = jQuery(this).attr('data-parentcat');
						var mycategoryobject = CategoryTools.myActualCategoryObject;
						var updateCategoryPromise = CategoryService.updateCategory(mycategoryid,mycategoryname,myparentcategory,mycategoryobject);
						updateCategoryPromise.then(function(arrResult) 
							{
								console.log(jQuery(this).attr('data-categoryname'))
							}, function(error) {
								alert('Error: ' + error);
							});
					}
					jQuery(this).attr('data-parentcat', myparentid);
				}
			});
	},
	bindClickCategoryTree: function(element) {
		var tgElement = jQuery(this).children().children();
		if(tgElement.hasClass('icon-remove-sign')) {
			console.log('ADD' + jQuery(this).parent().attr('data-id'));
			CategoryTools.myLocationCategoryArray.categories.push(jQuery(this).parent().attr('data-id'));
			if(jQuery(this).parent().closest('ul').hasClass('mynode'))
			{
				CategoryTools.toggleCategoryParent(jQuery(this).parent().closest('ul').parent(),'add');
			}
		}
		if(tgElement.hasClass('icon-ok-sign')) {
			console.log('REMOVE' + jQuery(this).parent().attr('data-id'));
			var index = CategoryTools.myLocationCategoryArray.categories.indexOf(jQuery(this).parent().attr('data-id'));
			if (index > -1) {
				CategoryTools.myLocationCategoryArray.categories.splice(index, 1);
			}
			if(jQuery(this).parent().closest('ul').hasClass('mynode'))
			{
				if(!jQuery(this).parent().siblings().find('.icon-ok-sign').length > 0 ) {
					CategoryTools.toggleCategoryParent(jQuery(this).parent().closest('ul').parent(),'remove');
				}
			}
		}
		tgElement.toggleClass('icon-remove-sign icon-ok-sign');
		jQuery(this).find(jQuery('.add-on')).toggleClass('btn-danger btn-success');
	},
	getCategoryTree: function(CategoryService,myInsertDataArray){
		CategoryTools.myLocationCategoryArray = myInsertDataArray;
		var getCategoryPromise = CategoryService.getCategory(1);
		getCategoryPromise.then(function(arrResult) {
			myTreeArr = arrResult.data.data;
			for(var i=0;i<myTreeArr.length;i++) {
				if(myTreeArr[i]['fid_parentcategory'] == 0)
				{
					jQuery('#categorytreelocation').append(CategoryTools.getTreeNode(myTreeArr[i]));
				}
			}
			jQuery('.mynode > div').bind( "click", CategoryTools.bindClickCategoryTree );
		});
	},
	toggleCategoryParent: function(element,action) {
		//console.log(jQuery(element).attr('data-id'));
		var ibtn = jQuery(element).children().children().siblings('span.add-on');
		var icon = jQuery(ibtn).children();
	
		if(action == 'add') {
			if(icon.hasClass('icon-remove-sign')) {
				icon.toggleClass('icon-remove-sign icon-ok-sign');
				ibtn.toggleClass('btn-danger btn-success');
				jQuery(element).children('.input-append').unbind( "click", CategoryTools.bindClickCategoryTree );	
			}
		}
		if(action == 'remove') {
			if(icon.hasClass('icon-ok-sign')) {
				jQuery(element).children('.input-append').bind( "click", CategoryTools.bindClickCategoryTree );
				icon.toggleClass('icon-remove-sign icon-ok-sign');
				ibtn.toggleClass('btn-danger btn-success');
				if(jQuery(element).find('.icon-ok-sign').length > 1) {
					icon.toggleClass('icon-remove-sign icon-ok-sign');
					ibtn.toggleClass('btn-danger btn-success');
					jQuery(element).children('.input-append').unbind( "click", CategoryTools.bindClickCategoryTree );					
				}
			}		
		}

		if(jQuery(element).parent().closest('ul').hasClass('mynode'))
		{
			CategoryTools.toggleCategoryParent(jQuery(element).parent().closest('ul').parent(),action);
		}
	},
	getTreeNode: function(node) {
		var mytree = '';	
		if(node['children'].length != 0) {
			mytree += '<li class="mynode" data-id="' + node['pid_category'] + '" data-parentcat="' + node['fid_parentcategory'] + '" data-categoryname="' + node['categoryname'] + '">';
			mytree += '<div class="input-append"><span id="appendedPrependedInput" class="input-xlarge uneditable-input">' + node['categoryname'] + '</span><span class="add-on btn-danger"><i class="icon-remove-sign icon-white addcat"></i></span></div>';
			mytree += '<ul class="mynode">';
			for(var i=0; i<node['children'].length ; i++) {
				mytree += CategoryTools.getTreeNode(node['children'][i]);	
			}
			mytree += '</ul>';		
		} 
		if(node['children'].length == 0) {
			mytree += '<li class="mynode" data-id="' + node['pid_category'] + '" data-parentcat="' + node['fid_parentcategory'] + '" data-categoryname="' + node['categoryname'] + '">';
			mytree += '<div class="input-append"><span id="appendedPrependedInput" class="input-xlarge uneditable-input">' + node['categoryname'] + '</span><span class="add-on btn-danger"><i class="icon-remove-sign icon-white addcat" ></i></span></div>';
			mytree += '</li>\n';
		}
		return mytree;
	}	
}