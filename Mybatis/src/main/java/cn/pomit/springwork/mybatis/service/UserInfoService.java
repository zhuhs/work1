package cn.pomit.springwork.mybatis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.pomit.springwork.mybatis.domain.UserInfo;
import cn.pomit.springwork.mybatis.mapper.UserInfoMapper;

@Service
public class UserInfoService {
	@Autowired
	UserInfoMapper userInfoDao;
	public UserInfo getUserInfoByUserName(String userName){
		return userInfoDao.findByUserName(userName);
	}
}
