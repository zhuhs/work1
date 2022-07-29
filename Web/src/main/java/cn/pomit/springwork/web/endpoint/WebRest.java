package cn.pomit.springwork.web.endpoint;

import java.util.UUID;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cn.pomit.springwork.web.entity.WelEntity;


@RestController
@RequestMapping("/pub")
public class WebRest {
	
	@RequestMapping(value = "/welCome", method = { RequestMethod.GET })
	public WelEntity welCome(@RequestParam(value = "reqType", required = false) String reqType) {
		String uuid = UUID.randomUUID().toString();
		String welMsg = "welcome 程序猿";
		if(reqType != null && "1000".equals(reqType)){
			welMsg = "welcome 程序媛";
		}
		WelEntity welEntity = new WelEntity();
		welEntity.setUuid(uuid);
		welEntity.setWelMsg(welMsg);
		return welEntity;
	}
}
