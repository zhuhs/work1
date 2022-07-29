package cn.pomit.springwork.mybatis.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import cn.pomit.springwork.mybatis.domain.UserInfo;
import cn.pomit.springwork.mybatis.service.UserInfoService;

@RestController
@RequestMapping("/mybatis")
public class MybatisRest {

	@Autowired
	UserInfoService userInfoService;
	
	@RequestMapping(value = "/test/{name}", method = { RequestMethod.GET })
	public UserInfo testMybatis(@PathVariable("name") String name) {
		return userInfoService.getUserInfoByUserName(name);
	}
}
