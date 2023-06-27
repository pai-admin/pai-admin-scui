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
		return await http.post("change/info", data);
	},
	editPassword: async function(data){
		return await http.post("change/pwd", data);
	},
	sevenLog: async function(data){
		return await http.get("log", data);
	},
	logout: async function(){
		return await http.get("logout");
	}
}
