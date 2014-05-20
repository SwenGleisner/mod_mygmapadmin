function loadValidation()
{
		jQuery('#myForm').validate({
			rules: {
				admin: "required",
				txtBezeichnung: "required",
				txtStrasse: "required",
				txtHausnummer: "required",
				txtPostleitzahl: "required",
				txtOrt: "required",
				slbBundesland: "required"
				},
			errorClass: "invalid",
			errorPlacement: function(error,element) {
				return true;
			},
			submitHandler: function(event) {
				var data = jQuery("#myForm").serialize();
            	//alert(data);
				jQuery.ajax({
					url: 'modules/mod_mym_gmapadmin/sqlquery/servicepointaction.php',
					type: 'POST',
					data: data,
					success: function(response) {
						jQuery('#myForm').remove();
						jQuery('#dialog').append(response);
						jQuery("#gmapAllServicePoints").flexReload({url: 'modules/mod_mym_gmapadmin/sqlquery/servicepointaction.php'});
					}            
				});
			}
		}); 
}