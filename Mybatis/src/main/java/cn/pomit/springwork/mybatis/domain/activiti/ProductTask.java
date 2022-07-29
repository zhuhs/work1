package cn.pomit.springwork.mybatis.domain.activiti;

import java.io.Serializable;

public class ProductTask implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 3481818865839076537L;

	String instanceId;
	String userName;
	String taskType;
	String content;
	String title;
	String curviewer;
	String taskId;

	public String getInstanceId() {
		return instanceId;
	}

	public void setInstanceId(String instanceId) {
		this.instanceId = instanceId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getTaskType() {
		return taskType;
	}

	public void setTaskType(String taskType) {
		this.taskType = taskType;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getCurviewer() {
		return curviewer;
	}

	public void setCurviewer(String curviewer) {
		this.curviewer = curviewer;
	}

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

}
