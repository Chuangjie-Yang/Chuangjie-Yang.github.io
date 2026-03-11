# 第三篇文章

这是我的第三篇markdown文章，测试代码块和引用。

## 多行代码块

```python
# Python代码示例
def fibonacci(n):
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci(n-1) + fibonacci(n-2)

# 测试
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

```java
// Java代码示例
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

## 嵌套引用

> 这是第一层引用
> 
> > 这是第二层引用
> > 
> > > 这是第三层引用

## 图片链接

[![示例图片](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20sunset%20over%20ocean&image_size=square)](https://github.com)

## 自动链接

https://www.google.com

## 邮箱链接

<example@example.com>

## 特殊字符

 反引号

\ 反斜杠

* 星号

_ 下划线

{} 花括号

[] 方括号

() 圆括号

# 井号

+ 加号

- 减号

. 点

! 感叹号