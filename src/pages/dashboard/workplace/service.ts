import axios from 'axios';
import { request } from 'umi';
import type { ActivitiesType, AnalysisData } from './data';

export async function queryLicenseUsers(page: any): Promise<{ data: any }> {
  return axios.get(
    `http://video-api-ecs-alb-501313528.ap-southeast-1.elb.amazonaws.com:8080/api/v1/license/users?page=${page.page}&limit=${page.limit}&searchKey=${page.searchKey}`,
  );
}

export async function queryActivities(): Promise<{ data: ActivitiesType[] }> {
  return request('/api/activities');
}

export async function fakeChartData(): Promise<{ data: AnalysisData }> {
  return request('/api/fake_workplace_chart_data');
}
