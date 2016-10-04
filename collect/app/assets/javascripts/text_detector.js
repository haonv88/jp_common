$(function() {

	// Create variables (in this scope) to hold the API and image size
	var jcrop_api,
	    boundx,
	    boundy,
	    x_pos,
	    y_pos;

	$('#target').Jcrop({
	  onChange: updatePreview,
	  onSelect: updatePreview
	},function(){
	  // Use the API to get the real image size
	  var bounds = this.getBounds();
	  boundx = bounds[0];
	  boundy = bounds[1];
	  // Store the API in the jcrop_api variable
	  jcrop_api = this;
	});

	$('#detector_container').mouseup(function (e) {
	  x_pos = e.clientX;
	  y_pos = e.clientY;
	  // var params = {};

	  // // params.search_image = JSON.stringify($("#preview")[0].toDataURL());
	  // params.search_image = $("#preview")[0].toDataURL();
	  // $.post( "/detect_text_image", params ).done(function( data ) {
	  //   debugger;
	  // });

	  textDecteror();
	})

	function textDecteror(){
		$.ajax({
		  url: "/detect_text_image",
		  type: "POST",
		  data: {
		    search_image: JSON.stringify(getDetectorParams())
		  },
		  dataType: 'json'
		}).done(function(data) {
		  var word_list = data.word_list;
      // $("#preview_tooltip").html(extract_meaning(found_word));
      if(word_list.length > 0){
      	var translation = ""
	      for(var i = 0; i < word_list.length; i++){
	      	var word = word_list[i];
	      	translation += extract_meaning(word) + "<br/>"
	      }	
	      $("#preview_tooltip").html(translation);
      }else{
      	$("#preview_tooltip").html("not found");
      }

		  var d = document.getElementById('preview_tooltip');
	    d.style.position = "absolute";
	    d.style.left = x_pos + 'px';
	    d.style.top = y_pos + 'px';
		}).fail(function() {
		  console.log("error");
		});
	}

	function getDetectorParams(){
		return {
			image_data: $("#preview")[0].toDataURL("image/jpeg", 1.0)
			// image_data: $('#preview_pic').attr("src")
		}
	}

	function updatePreview(c)
	{
	  var imageObj = $("#target")[0];
    var canvas = $("#preview")[0];
    canvas.width = c.w;
    canvas.height = c.h;
    var context = canvas.getContext("2d");
    context.drawImage(imageObj, c.x, c.y, c.w, c.h, 0, 0, canvas.width, canvas.height);
    // var p = document.getElementById('preview');
    // p.style.position = "absolute";
    // p.style.left = x_pos + 'px';
    // p.style.top = (y_pos - 200) + 'px';

    // $('#preview_pic').attr("src", $("#preview")[0].toDataURL("image/jpeg", 1.0));

    // var d = document.getElementById('preview_pic');
    // d.style.position = "absolute";
    // d.style.left = x_pos + 'px';
    // d.style.top = y_pos + 'px';
  };

  function extract_meaning(word){
    if(word.word){
      return word.word + " (" + word.kana + ") [" + word.cn_mean + "] <br/>" + word.mean;
    }else if(word.kana){
      return word.kana + ": " + word.mean;
    }else{
      return "not found";
    }
  }
});