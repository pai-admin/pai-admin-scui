import http from "@/utils/request"

export default {
	upload: async function(data, config={}){
		return await http.post("upload/file", data, config);
	},
	dict_type: {
		list: async function(data={}){
			return await http.get("dict_type/list", data);
		},
		add: async function(data={}){
			return await http.post("dict_type/add", data);
		},
		edit: async function(data={}){
			return await http.put("dict_type/edit", data);
		},
		del: async function(data={}){
			return await http.delete("dict_type/del", data);
		},
	},
	dict_data: {
		list: async function(data={}){
			return await http.get("dict_data/list", data);
		},
		add: async function(data={}){
			return await http.post("dict_data/add", data);
		},
		edit: async function(data={}){
			return await http.put("dict_data/edit", data);
		},
		del: async function(data={}){
			return await http.delete("dict_data/del", data);
		},
	},
	log: {
		list: async function(data={}){
			return await http.get("log/list", data);
		},
	}
}
