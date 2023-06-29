import http from "@/utils/request"

export default {
	token: async function(data={}){
		return await http.post("login", data);
	},
	verify: async function(){
		return await http.get("get-code");
	},
	getAccountInfo: async function(){
		return await http.get("info");
	},
	getMenuInfo: async function(){
		return await http.get("auth");
	},
	saveAccountInfo: async function(data){
		return await http.post("info/edit", data);
	},
	editPassword: async function(data){
		return await http.post("editPwd", data);
	},
	log: async function(data={}){
		return await http.get("log/my", data);
	},
	logout: async function(){
		return await http.post("logout");
	}
}
