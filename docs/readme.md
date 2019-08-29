# 知识点

## rxjs 常见管道操作符(version 6.x)

pipe来包裹所有操作符方法，使。移除，用逗号连接。

rxjs5.5以上使用pipe方法而非链式调用。所有链式的起点都用Pipe来开始，之后的每一次处理都用逗号隔开。

在使用angular的时候，很多情况需要使用debounceTime

do/tab 透明地执行操作或副作用，比如打印日志。

### 1、concat

    通过顺序地发出多个 Observables 的值将它们连接起来，一个接一个的。
    
    

## date-fns 使用
date-fns 提供了最全面，最简单和一致的工具集，用于在浏览器和 Node.js 中操作 JavaScript 日期

TypeScript日期工具: date-fns日期工具的使用方法


函数名 |	作用
-|-
isToday() |	判断传入日期是否为今天
isYesterday() |	判断传入日期是否为昨天
isTomorrow()	判断传入日期是否为
format()	日期格式化
addDays()	获得当前日期之后的日期
addHours()	获得当前时间n小时之后的时间点
addMinutes()	获得当前时间n分钟之后的时间
addMonths()	获得当前月之后n个月的月份
subDays()	获得当前时间之前n天的时间
subHours()	获得当前时间之前n小时的时间
subMinutes()	获得当前时间之前n分钟的时间
subMonths()	获得当前时间之前n个月的时间
differenceInYears()	获得两个时间相差的年份
differenceInWeeks()	获得两个时间相差的周数
differenceInDays()	获得两个时间相差的天数
differenceInHours()	获得两个时间相差的小时数
differenceInMinutes()	获得两个时间相差的分钟数


## angular 变动

1、ViewChild() 同理有`@ContentChild('editTemplate',{ read: true, static: false })`
```javascript
Before:

@ViewChild('foo') foo: ElementRef;

After:

// query results available in ngOnInit
@ViewChild('foo', {static: true}) foo: ElementRef;

OR

// query results available in ngAfterViewInit
@ViewChild('foo', {static: false}) foo: ElementRef;
```

2、rxjs 的箭头函数要带入参类型
```javascript
  initializeTaskLists(prj: Project): Observable<Project> {
    const id = prj.id;
    return merge(
      this.add({name: '待办', projectId: id, order: 1}),
      this.add({name: '进行中', projectId: id, order: 2}),
      this.add({name: '已完成', projectId: id, order: 3})).pipe(
        reduce((r, x: Project) => [...r, x], []),
        map(tls => ({...prj, taskLists: tls.map(tl => tl.id)}))
    );
  }
```

3、mat-input-container 过期，被mat-form-field取代 [详见](https://github.com/angular/material2/blob/master/CHANGELOG.md#600-beta5-2018-03-23)
