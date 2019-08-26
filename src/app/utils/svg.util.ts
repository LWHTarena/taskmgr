import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

export const loadSvgResource = (ir: MatIconRegistry, ds: DomSanitizer) => {
    const imgDir = 'assets/img';
    const avatarDir = `${imgDir}/avatar`;
    const sidebarDir = `${imgDir}/sidebar`;
    const dayDir = `${imgDir}/days`;
    const iconDir = `${imgDir}/icons`;
    ir.addSvgIcon('gifts', ds.bypassSecurityTrustResourceUrl('assets/gifts.svg'));

    ir.addSvgIconSetInNamespace('avatars', ds.bypassSecurityTrustResourceUrl(`${avatarDir}/avatars.svg`));
    ir.addSvgIcon('unassigned', ds.bypassSecurityTrustResourceUrl(`${avatarDir}/unassigned.svg`));
    ir.addSvgIcon('day', ds.bypassSecurityTrustResourceUrl(`${sidebarDir}/day.svg`));
    ir.addSvgIcon('week', ds.bypassSecurityTrustResourceUrl(`${sidebarDir}/week.svg`));
    ir.addSvgIcon('month', ds.bypassSecurityTrustResourceUrl(`${sidebarDir}/month.svg`));
    ir.addSvgIcon('project', ds.bypassSecurityTrustResourceUrl(`${sidebarDir}/project.svg`));
    ir.addSvgIcon('projects', ds.bypassSecurityTrustResourceUrl(`${sidebarDir}/projects.svg`));
    ir.addSvgIcon('move', ds.bypassSecurityTrustResourceUrl(`${iconDir}/move.svg`));
    ir.addSvgIcon('add', ds.bypassSecurityTrustResourceUrl(`${iconDir}/add.svg`));
    ir.addSvgIcon('delete', ds.bypassSecurityTrustResourceUrl(`${iconDir}/delete.svg`));

    const days = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
    ];
    days.forEach(day => ir.addSvgIcon(`day${day}`, ds.bypassSecurityTrustResourceUrl(`${dayDir}/day${day}.svg`)));
};
