import axios from 'axios';
import { request } from 'umi';
import type { TagType } from './data';

export async function queryTags(): Promise<{ data: { list: TagType[] } }> {
  return request('/api/tags');
}

export async function queryLicenses(page: any): Promise<{ data: any }> {
  return axios.get(
    `http://video-api-ecs-alb-501313528.ap-southeast-1.elb.amazonaws.com:8080/api/v1/license?page=${page.page}&limit=${page.limit}`,
  );
}
