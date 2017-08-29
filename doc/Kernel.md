# Kernel

为一个目标字段定义其关联事物。

## 构造函数

| 参数 | 含义 |
| :---: | :---: |
| root | 目标对象 |
| path | 目标字段属性名称（路径） |
| relations | 目标字段关联事物 |
| relations.resultIn | 赋值影响 |
| relations.dnstream | 关联的下游字段 |
| relations.resultFrom | 取值函数 |
| relations.upstream | 关联的上游字段 |
| relations.lazy | 是否延迟计算字段 |

## resultIn

resultIn（赋值影响）是指字段的值更新后，需要执行其他连带更新操作。如果定义了resultIn，那么在目标字段赋值时，会把root作为this，把新值作为参数，执行赋值影响。理论上，所有数据的响应式更新都可以通过各个字段的resultIn来实现。

## dnstream, upstream

dnstream（下游字段）是指值受当前字段影响的字段。如果定义了dnstream，那么在目标字段赋值时，会对所有存在取值函数且非延迟计算的下游字段重新取值和赋值。

upstream（上游字段）是指影响当前字段值的字段。如果定义了upstream，那么目标字段相应地也成为其上游字段的下游字段，反之亦然。

如果字段A在其dnstream中包含了字段B，或字段B在其upstream中包含了字段A，则A和B互为上下游字段。

如果一个字段没有下游字段，则它是一个叶子字段。如果一个字段的值的变更不影响其他字段，或者把对其他字段的影响包含在了它的resultIn里，那么它作为叶子字段存在，其他字段也不应把它作为上游字段。

## resultFrom

当一个字段有多个上游字段时，这个字段的值就很可能受多个字段影响；为了不在多个上游字段的resultIn中重复执行这一字段的计算表达式，可将这一字段的计算过程定义在它的resultFrom（取值函数）中。一旦字段定义了resultFrom取值函数，那么在字段取值时，会返回取值函数的执行结果；如果同时定义了upstream（上游字段），那么各个上游字段的值会作为取值函数的实参。

## lazy

是否“延迟计算”字段，与“响应式更新”相对。

一个字段被响应式地更新，不外乎以下几种情况：

1. 在其他字段的resultIn中存在了这个字段的赋值逻辑
2. 作为其他字段的下游字段，同时这个字段定义了resultFrom取值逻辑

如果字段不需要实时更新自己的值，而是只需要在取值的时候计算得出，那么对于这个字段，只需要定义其resultFrom即可。一般对于这种字段，不需要存在上游字段。