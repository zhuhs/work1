package cn.pomit.springwork.mybatis.mapper.activiti;

import java.util.List;

import cn.pomit.springwork.mybatis.domain.activiti.ProductTask;

public interface ProductMapper {

	public void save(ProductTask userTask);
	
	public List<ProductTask> getUserTask(String userid);
	
	public ProductTask getUserTaskByInstanceId(String instanceId);
	
	public void updateStatus(ProductTask userTask);

	public List<ProductTask> getUserTaskByCurrentViwer(String userid);
}
