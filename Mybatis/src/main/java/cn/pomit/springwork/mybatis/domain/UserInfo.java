package cn.pomit.springwork.mybatis.domain;

public class UserInfo {
	private String userName;
	private String passwd;
	private String name;
	private String mobile;
	private String valid;
	private String userType;

	public UserInfo() {

	}

	public UserInfo(UserInfo src) {
		this.userName = src.userName;
		this.passwd = src.passwd;
		this.name = src.name;
		this.mobile = src.mobile;
		this.valid = src.valid;
		this.userType = src.userType;
	}

	public UserInfo(String userName, String passwd, String name, String mobile, String valid) {
		super();
		this.userName = userName;
		this.passwd = passwd;
		this.name = name;
		this.mobile = mobile;
		this.valid = valid;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getUserName() {
		return userName;
	}

	public void setPasswd(String passwd) {
		this.passwd = passwd;
	}

	public String getPasswd() {
		return passwd;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getMobile() {
		return mobile;
	}

	public void setValid(String valid) {
		this.valid = valid;
	}

	public String getValid() {
		return valid;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

}
