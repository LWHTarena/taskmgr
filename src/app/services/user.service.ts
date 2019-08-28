import {Inject, Injectable} from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {User, Project} from '../domain';
import {from, Observable} from 'rxjs';
import {filter, map, reduce, switchMap} from 'rxjs/operators';

@Injectable()
export class UserService {
    private readonly domain = 'users';
    private headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    constructor(@Inject('BASE_CONFIG') private config,
                private http: HttpClient) {
    }


    searchUsers(filter: string): Observable<User[]> {
        const uri = `${this.config.uri}/${this.domain}`;
        return this.http.get(uri, {params: {email_like: filter}}).pipe(map(res => res as User[]));
    }

    getUsersByProject(projectId: string): Observable<User[]> {
        const uri = `${this.config.uri}/users`;
        return this.http.get(uri, {params: {projectId: projectId}}).pipe(map(res => res as User[]));
    }

    addProjectRef(user: User, projectId: string): Observable<User> {
        const uri = `${this.config.uri}/${this.domain}/${user.id}`;
        const projectIds = (user.projectIds) ? user.projectIds : [];
        return this.http
            .patch(uri, JSON.stringify({projectIds: [...projectIds, projectId]}), {headers: this.headers}).pipe(map(res => res as User));
    }

    removeProjectRef(user: User, projectId: string): Observable<User> {
        const uri = `${this.config.uri}/${this.domain}/${user.id}`;
        const projectIds = (user.projectIds) ? user.projectIds : [];
        const index = projectIds.indexOf(projectId);
        const toUpdate = [...projectIds.slice(0, index), ...projectIds.slice(index + 1)];
        return this.http.patch(uri, JSON.stringify({projectIds: toUpdate}), {headers: this.headers}).pipe(map(res => res as User));
    }

    batchUpdateProjectRef(project: Project): Observable<User[]> {
        const projectId = project.id;
        const memberIds = project.members ? project.members : [];
        return from(memberIds).pipe(
          switchMap(id => {
            const uri = `${this.config.uri}/${this.domain}/${id}`;
            return this.http.get(uri).pipe(map(res => res as User));
          }),
          filter(user => user.projectIds.indexOf(projectId) < 0),
          switchMap(u => this.addProjectRef(u, projectId)),
          reduce((users, curr) => [...users, curr] , [])
        );
    }
}
