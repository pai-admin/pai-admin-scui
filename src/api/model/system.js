import config from "@/config"
import http from "@/utils/request"

export default {
	menu: {
		list: async function(data={}){
			return await http.get("menu/list", data);
		},
		add: async function(data = {}){
			return await http.post("menu/add", data);
		},
		edit: async function(data = {}){
			return await http.put("menu/edit", data);
		},
		del: async function(data = {}){
			return await http.delete("menu/del", data);
		}
	},
	dic: {
		tree: {
			url: `${config.API_URL}/system/dic/tree`,
			name: "获取字典树",
			get: async function(){
				return await http.get(this.url);
			}
		},
		list: {
			url: `${config.API_URL}/system/dic/list`,
			name: "字典明细",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		get: {
			url: `${config.API_URL}/system/dic/get`,
			name: "获取字典数据",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	role: {
		list: async function(data={}){
			return await http.get("role/list", data);
		},
		add: async function(data={}){
			return await http.post("role/add", data);
		},
		edit: async function(data={}){
			return await http.put("role/edit", data);
		},
		del: async function(data={}){
			return await http.delete("role/del", data);
		}
	},
	dept: {
		list: async function(data={}){
			return await http.get("dept/list", data);
		},
		add: async function(data={}){
			return await http.post("dept/add", data);
		},
		edit: async function(data={}){
			return await http.put("dept/edit", data);
		},
		del: async function(data={}){
			return await http.delete("dept/del", data);
		},
		option: async function(data={}){
			return await http.get("dept/option", data);
		},
	},
	user: {
		list: {
			url: `${config.API_URL}/system/user/list`,
			name: "获取用户列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	account: {
		list: async function(data={}){
			return await http.get("account/list", data);
		},
		add: async function(data={}){
			return await http.post("account/add", data);
		},
		edit: async function(data={}){
			return await http.put("account/edit", data);
		},
		del: async function(data={}){
			return await http.delete("account/del", data);
		},
	},
	log: {
		list: async function(data={}){
			return await http.get("log/list", data);
		},
		del: async function(data={}){
			return await http.delete("log/del", data);
		},
	},
	table: {
		list: {
			url: `${config.API_URL}/system/table/list`,
			name: "表格列管理列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		info: {
			url: `${config.API_URL}/system/table/info`,
			name: "表格列管理详情",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	tasks: {
		list: {
			url: `${config.API_URL}/system/tasks/list`,
			name: "系统任务管理",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	}
}
