import API from "@/api";

//上传配置

export default {
	apiObj: API.common.upload,			//上传请求API对象
	filename: "file",					//form请求时文件的key
	successCode: 200,					//请求完成代码
	maxSize: 10,						//最大文件大小 默认10MB
	parseData: function (res) {
		return {
			fileName: res.fileName,
			src: res.filePath,
		}
	},
	apiObjFile: API.common.upload,	//附件上传请求API对象
	maxSizeFile: 200					//最大文件大小 默认10MB
}
