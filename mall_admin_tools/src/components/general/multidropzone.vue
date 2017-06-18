<template>

  <div>
  	<form :action="url" class="vue-dropzone dropzone" :id="id">
  </form>
     <span>Tips: 可以穿多张图片，但是建议不要超过四张~</span>
  </div>

</template>

<script>

  export default {
  	data(){
  		return{
  			
  		}
  	},
    props: {
      id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      method: {
      	type: String,
      	default: 'post'
      },
      clickable: {
        type: Boolean,
        default: true
      },
      acceptedFileTypes: {
        type: String
      },
      thumbnailHeight: {
        type: Number,
        default: 200
      },
      thumbnailWidth: {
        type: Number,
        default: 200
      },
      showRemoveLink: {
        type: Boolean,
        default: true
      },
      maxFileSizeInMB: {
        type: Number,
        default: 1
      },
      maxNumberOfFiles: {
        type: Number,
        default: 5
      },
      autoProcessQueue: {
        type: Boolean,
        default: false
      },
      useFontAwesome: {
        type: Boolean,
        default: false
      },
      headers: {
        type: Object
      },
			language: {
				type: Object,
				default: function() {
					return {
						dictDefaultMessage: '<br>点击选择上传文件',
						dictCancelUpload: '取消上传',
						dictCancelUploadConfirmation: '确定删除上传？',
						dictFallbackMessage: '您的浏览器暂不支持该方法',
						dictFallbackText: 'Please use the fallback form below to upload your files like in the olden days.',
						dictFileTooBig: '文件过大！',
						dictInvalidFileType: '您无法传输该格式的文件',
						dictMaxFilesExceeded: '您无法传输更多的文件了',
						dictRemoveFile: '移除',
						dictRemoveFileConfirmation: null,
						dictResponseError: 'Server responded with {{statusCode}} code.',
					}
				}
			},
      useCustomDropzoneOptions: {
        type: Boolean,
        default: false
      },
      dropzoneOptions: {
        type: Object
      }
    },
    methods: {
      setOption: function (option, value) {
        this.dropzone.options[option] = value
      },
      removeAllFiles: function () {
        this.dropzone.removeAllFiles(true)
      },
      processQueue: function () {
        this.dropzone.processQueue()
      },
      removeFile: function (file) {
        this.dropzone.removeFile(file)
      },
      upload: function(){
        this.dropzone.processQueue()
      }
    },
    computed: {
      cloudIcon: function () {
        if (this.useFontAwesome) {
          return '<i class="fa fa-cloud-upload"></i>'
        } else {
          return  '<i class="material-icons"></i>'
        }
      },
      doneIcon: function () {
        if (this.useFontAwesome) {
          return '<i class="fa fa-check"></i>'
        } else {
          return  ' <i class="material-icons" style="font-size:22px; color:#fff;">上传成功！</i>'
        }
      },
      errorIcon: function () {
        if (this.useFontAwesome) {
          return '<i class="fa fa-close"></i>'
        } else {
          return  ' <i class="material-icons" style="font-size:22px; color:#fff;">上传失败！</i>'
        }
      }
    },
    mounted () {
      if (this.$isServer) {
        return
      }
      var Dropzone = require('dropzone')
      Dropzone.autoDiscover = false
      var element = document.getElementById(this.id)
      if (!this.useCustomDropzoneOptions) {
        this.dropzone = new Dropzone(element, {
          clickable: this.clickable,
          method: this.method,
          thumbnailWidth: this.thumbnailWidth,
          thumbnailHeight: this.thumbnailHeight,
          maxFiles: this.maxNumberOfFiles,
          maxFilesize: this.maxFileSizeInMB,
          addRemoveLinks: this.showRemoveLink,
          acceptedFiles: this.acceptedFileTypes,
          autoProcessQueue: this.autoProcessQueue,
          headers: this.headers,
          previewTemplate: '<div class="dz-preview dz-file-preview">  <div class="dz-image" style="width:' + this.thumbnailWidth + 'px;height:' + this.thumbnailHeight + 'px"><img data-dz-thumbnail /></div>  <div class="dz-details">    <div class="dz-size"><span data-dz-size></span></div>    <div class="dz-filename"><span data-dz-name></span></div>  </div>  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>  <div class="dz-error-message"><span data-dz-errormessage></span></div>  <div class="dz-success-mark" style="margin-left:-50px">' + this.doneIcon + ' </div>  <div class="dz-error-mark" style="margin-left:-50px">' + this.errorIcon + '</div></div>',
					dictDefaultMessage: this.cloudIcon + this.language.dictDefaultMessage,
    			dictCancelUpload: this.language.dictCancelUpload,
    			dictCancelUploadConfirmation: this.language.dictCancelUploadConfirmation,
    			dictFallbackMessage: this.language.dictFallbackMessage,
    			dictFallbackText: this.language.dictFallbackText,
    			dictFileTooBig: this.language.dictFileTooBig,
    			dictInvalidFileType: this.language.dictInvalidFileType,
    			dictMaxFilesExceeded: this.language.dictMaxFilesExceeded,
    			dictRemoveFile: this.language.dictRemoveFile,
    			dictRemoveFileConfirmation: this.language.dictRemoveFileConfirmation,
    			dictResponseError: this.language.dictResponseError,
          parallelUploads: 1
        })
      } else {
        this.dropzone = new Dropzone(element, this.dropzoneOptions)
      }
      // Handle the dropzone events
      var vm = this
      this.dropzone.on('thumbnail', function (file) {
        vm.$emit('vdropzone-thumbnail', file)
      })
      this.dropzone.on('addedfile', function (file) {
      	console.log('添加了')
        vm.$emit('vdropzone-file-added', file)
      })

      this.dropzone.on('removedfile', function (file) {
        vm.$emit('vdropzone-removed-file', file);
        console.log('删除了')
      })
			
      this.dropzone.on('success', function (file, response) {
      	console.log(response)
      	if(response.code=='000000'){
      		//上传成功
      		vm.dropzone.processQueue()
      	}
        vm.$emit('vdropzone-success', file, response)
      })

      this.dropzone.on('successmultiple', function (file, response) {
        vm.$emit('vdropzone-success-multiple', file, response)
      })

      this.dropzone.on('error', function (file, error, xhr) {
        vm.$emit('vdropzone-error', file, error, xhr)
      })

      this.dropzone.on('sending', function(file, xhr, formData){
        vm.$emit('vdropzone-sending', file, xhr, formData)
      })

      this.dropzone.on('sendingmultiple', function(file, xhr, formData){
        vm.$emit('vdropzone-sending-multiple', file, xhr, formData)
      })

      this.dropzone.on('queuecomplete', function(file, xhr, formData){
        vm.$emit('vdropzone-queue-complete', file, xhr, formData)
      })
    },

    beforeDestroy () {
      this.dropzone.destroy();
    }
  }

</script>

<style scoped>

  .vue-dropzone {
  border: 2px solid #E5E5E5;
  font-family: 'Arial', sans-serif;
  letter-spacing: 0.2px;
  color: #777;
  border-radius: 5px;
  transition: background-color 0.2s linear;
}
.vue-dropzone:hover {
  background-color: #F6F6F6;
}
.vue-dropzone i {
  color: #CCC;
}
.vue-dropzone .dz-preview .dz-image {
  border-radius: 0px;
}
.vue-dropzone .dz-preview .dz-image:hover img {
  transform: none;
  -webkit-filter: none;
}
.vue-dropzone .dz-preview .dz-details {
  bottom: 0px;
  top: 0px;
  color: white;
  background-color: rgba(33, 150, 243, 0.8);
  transition: opacity .2s linear;
  text-align: left;
}
.vue-dropzone .dz-preview .dz-details .dz-filename span,
.vue-dropzone .dz-preview .dz-details .dz-size span {
  background-color: transparent;
}
.vue-dropzone .dz-preview .dz-details .dz-filename:not(:hover) span {
  border: none;
}
.vue-dropzone .dz-preview .dz-details .dz-filename:hover span {
  background-color: transparent;
  border: none;
}
.vue-dropzone .dz-preview .dz-progress .dz-upload {
  background: #cccccc;
}
.vue-dropzone .dz-preview .dz-remove {
  position: absolute;
  z-index: 30;
  color: white;
  margin-left: 15px;
  padding: 10px;
  top: inherit;
  bottom: 15px;
  border: 2px white solid;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 1.1px;
  opacity: 0;
}
.vue-dropzone .dz-preview:hover .dz-remove {
  opacity: 1;
}
.vue-dropzone .dz-preview .dz-success-mark,
.vue-dropzone .dz-preview .dz-error-mark {
  margin-left: auto!important;
  margin-top: auto!important;
  width: 100%!important;
  top: 35%!important;
  left: 0;
}
.vue-dropzone .dz-preview .dz-success-mark i,
.vue-dropzone .dz-preview .dz-error-mark i {
  color: white!important;
  font-size: 10rem!important;
  text-align: center;
}

.btn-default{
	 display: inline-block;
  margin-bottom: 0; 
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none; 
  border: 1px solid transparent;
  white-space: nowrap;
}

</style>
