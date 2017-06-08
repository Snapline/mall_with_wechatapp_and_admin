<template>
  <div class="components-container">
    <div class="editor-container">
    	<el-input v-model="input" placeholder="请输入文章标题"></el-input>
    	
		    <vue-base64-file-upload 
	        class="profile_area"
	        accept="image/png,image/jpeg"
	        image-class="message_image"
	        input-class="profile_input"
	        :default-preview="baseImageString"
	        placeholder="点击上传文章主图"
	        :max-size="customImageMaxSize"
	        @size-exceeded="onSizeExceeded"
	        @file="onFile"
	        @load="onLoad" />
		        
       <vue-editor v-model="content"></vue-editor>
    </div>
    
  </div>
</template>
<script>
    import { VueEditor } from 'vue2-editor';
    import VueBase64FileUpload from 'vue-base64-file-upload';
    export default {
      components: { VueEditor, VueBase64FileUpload },
      data() {
        return {
          content: ''
        }
      },
      methods: {
      }
    };
</script>