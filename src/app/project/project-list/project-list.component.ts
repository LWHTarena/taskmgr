import {Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material';
import {NewProjectComponent} from '../new-project/new-project.component';
import {InviteComponent} from '../invite/invite.component';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {slideToRight} from '../../anim/router.anim';
import {listAnimation} from '../../anim/list.anim';
import {Project} from '../../domain';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';

import {Store} from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions/project.action';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [slideToRight, listAnimation]
})
export class ProjectListComponent implements OnInit, OnDestroy {

    @HostBinding('@routeAnim') state;
    projects$: Observable<Project[]>;
    listAnim$: Observable<number>;

    constructor(private dialog: MatDialog,
                private cd: ChangeDetectorRef,
                private store$: Store<fromRoot.State>) {
        this.store$.dispatch(new actions.LoadProjectsAction({}));
        this.projects$ = this.store$.select(fromRoot.getProjects);
        this.listAnim$ = this.projects$.map(p => p.length);
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
    }

    selectProject(project: Project): void {
        this.store$.dispatch(new actions.SelectProjectAction(project));
    }

    openNewProjectDialog() {
        const img = `/assets/img/covers/${Math.floor(Math.random() * 40)}_tn.jpg`;
        const dialogRef = this.dialog.open(NewProjectComponent,
            {data: {thumbnails: this.getThumbnailsObs(), img: img}});
        dialogRef.afterClosed()
            .take(1)           // 不用去销毁，自动完成状态
            .filter(n => n)
            .map(val => ({...val, coverImg: this.buildImgSrc(val.coverImg)}))
            .subscribe(project => {
                this.store$.dispatch(new actions.AddProjectAction(project));
            });
    }

    launchInvite(project) {
        let members = [];
        this.store$.select(fromRoot.getProjectMembers(project.id))
            .take(1)
            .subscribe(m => members = m);
        const dialogRef = this.dialog.open(InviteComponent, {data: {members: members}});
        // 使用 take(1) 来自动销毁订阅，因为 take(1) 意味着接收到 1 个数据后就完成了
        dialogRef.afterClosed().take(1).subscribe(val => {
            if (val) {
                this.store$.dispatch(new actions.InviteMembersAction({projectId: project.id, members: val}));
            }
        });
    }

    launchUpdateDialog(project: Project) {
        const dialogRef = this.dialog.open(NewProjectComponent,
            {data: {thumbnails: this.getThumbnailsObs(), project: project}});
        dialogRef.afterClosed()
            .take(1)           // 不用去销毁，自动完成状态
            .filter(n => n)
            .map(val => ({...val, id: project.id, coverImg: this.buildImgSrc(val.coverImg)}))
            .subscribe(val => {
                this.store$.dispatch(new actions.UpdateProjectAction(val));
            });
    }

    launchConfirmDialog(project) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {title: '删除项目', content: '你确认删除该项目吗?'}});
        dialogRef.afterClosed()
            .take(1)           // 不用去销毁，自动完成状态
            .filter(n => n)
            .subscribe(prj => {
                this.store$.dispatch(new actions.DeleteProjectAction(project));
            });
    }

    private getThumbnailsObs() {
        return _.range(0, 40)
            .map(i => `/assets/img/covers/${i}_tn.jpg`);
    }

    private buildImgSrc(img: string): string {
        return img.indexOf('_') > -1 ? img.split('_', 1)[0] + '.jpg' : img;
    }

}
