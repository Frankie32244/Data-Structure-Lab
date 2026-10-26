export const SHA='a410c4b08eb5bc508de49f1128ca884696a7f928';
export const catalog=[
 ['sequence','顺序表','Sequence List','sequence_list/seqlist.c','连续存储 · 按位访问','O(n)'],
 ['linked','单链表','Linked List','linked_list/linkedlist.c','带头结点 · 单向连接','O(n)'],
 ['doubly','双向链表','Doubly Linked List','doubly_linked_list/doublylist.c','双向连接 · 就近定位','O(n)'],
 ['stack','栈','Stack','stack/stack.c','顺序栈 · 后进先出','O(1)'],
 ['queue','队列','Queue','queue/queue.c','数组移位 · 先进先出','O(n)'],
 ['tree','二叉树','Binary Tree','binarytree/binarytree.c','数组建树 · 递归遍历','O(n)'],
 ['hash','哈希表','Hash Table','hashtable/hash.c','100 槽 · 直接寻址','O(k)']
];
export function hash(key){let h=0;for(const c of key)h=((h<<5)+c.charCodeAt(0))>>>0;return h%100;}
export function initial(type){return type==='hash'?{[hash('cat')]:{key:'cat',value:12},[hash('dog')]:{key:'dog',value:28}}:type==='tree'?[42,24,68,12,36,56,80]:[12,24,36,48,60];}
export function treeOrder(a,mode='pre'){const out=[];function walk(i){if(i>=a.length||a[i]===-1)return;if(mode==='pre')out.push(i);walk(2*i+1);if(mode==='in')out.push(i);walk(2*i+2);if(mode==='post')out.push(i);}walk(0);return out;}
export function treeStats(a){const ids=treeOrder(a);return {count:ids.length,depth:ids.length?Math.max(...ids.map(i=>Math.floor(Math.log2(i+1))+1)):0,leaves:ids.filter(i=>!ids.includes(2*i+1)&&!ids.includes(2*i+2)).length};}
export function operations(type){if(type==='tree')return [['pre','前序遍历'],['in','中序遍历'],['post','后序遍历'],['stats','结构统计']];if(type==='hash')return [['insert','插入 / 覆盖'],['search','按键查找'],['modify','修改值'],['clear','清空']];if(type==='stack')return [['insert','入栈'],['delete','出栈'],['get','查看栈顶'],['traverse','遍历'],['clear','清空']];if(type==='queue')return [['insert','入队'],['delete','出队'],['get','查看队首'],['traverse','遍历']];return [['insert','插入'],['delete','删除'],['modify','修改'],['get','按位查找'],['search','按值搜索（扩展）'],['traverse','正向遍历'],...(type==='doubly'?[['backward','反向遍历']]:[]),['reverse','反转'],['clear','清空']];}
export function plan(type,data,op,{value=18,position=3,key='apple'}={}){
 const frames=[];let a=structuredClone(data);const emit=(text,active=[],line=0,output=[])=>frames.push({data:structuredClone(a),text,active,line,output:[...output]});
 if(['insert','modify','search'].includes(op)&&type!=='tree'&&(!Number.isInteger(value)||value< -2147483648||value>2147483647))throw Error('值必须是 32 位整数。');
 emit('准备执行：检查结构与输入。');
 if(op==='clear'){a=type==='hash'?{}:[];emit('释放所有元素，长度归零。',[],2);return frames;}
 if(type==='tree'){const ids=treeOrder(a,op==='stats'?'pre':op);const out=[];for(const i of ids){out.push(a[i]);emit(`访问节点 ${a[i]}（数组下标 ${i}）。`,[i],1,out);}if(op==='stats'){const s=treeStats(a);emit(`节点 ${s.count} 个，叶子 ${s.leaves} 个，深度 ${s.depth}。`,[],3);}else emit('遍历完成。',[],3,out);return frames;}
 if(type==='hash'){if(!/^[\x21-\x7E]{1,24}$/.test(key))throw Error('键请输入 1–24 个可见 ASCII 字符，以匹配 C 字符哈希。');let h=0;for(const c of key){h=((h<<5)+c.charCodeAt(0))>>>0;emit(`读取字符 ${c}：hash = (hash << 5) + ${c.charCodeAt(0)} → ${h}`,[],1);}const i=h%100;emit(`hash % 100 = ${i}，定位槽位。`,[i],2);if(op==='insert'){const old=a[i];emit(old?`槽 ${i} 已有键 ${old.key}；原实现直接覆盖，不处理碰撞。`:`槽 ${i} 为空，创建 Entry。`,[i],2);a[i]={key,value};emit(`写入 ${key} → ${value}。`,[i],3);}else if(a[i]?.key===key){if(op==='modify')a[i].value=value;emit(op==='modify'?`值已修改为 ${value}。`:`查找成功：${a[i].value}。`,[i],3);}else emit('键不存在，返回 -1；必须同时比较键字符串。',[i],3);return frames;}
 const n=a.length;const p=type==='stack'?n-1:type==='queue'?(op==='insert'?0:n-1):position-1;
 if(['insert','modify'].includes(op)&&(!Number.isInteger(value)||value< -2147483648||value>2147483647))throw Error('值必须是 32 位整数。');
 if(op==='insert'&&n>=100)throw Error('演示容量为 100，已满。');
 if(['delete','get','modify'].includes(op)&&!n)throw Error('结构为空，无法执行此操作。');
 if(['sequence','linked','doubly'].includes(type)&&['insert','delete','get','modify'].includes(op)&&(!Number.isInteger(position)||position<1||position>n+(op==='insert'?1:0)))throw Error(`位置应为 1–${n+(op==='insert'?1:0)}。`);
 const locate=()=>{if(type==='sequence')emit(`直接定位第 ${position} 个元素。`,[p],1);else if(type==='linked'||type==='doubly'){const ids=type==='doubly'&&position>n/2?Array.from({length:n-p},(_,j)=>n-1-j):Array.from({length:Math.min(p+1,n)},(_,j)=>j);ids.forEach(i=>emit(`沿 ${ids[0]===n-1?'prev':'next'} 移动到第 ${i+1} 个节点。`,[i],1));}else emit(type==='stack'?`top 指向下一空位 ${n}；当前栈顶下标 ${n-1}。`:`rear = 0，front = ${n}；最早入队元素在下标 ${n-1}。`,n?[Math.max(0,p)]:[],1);};
 if(op==='insert'){if(type==='sequence'||type==='queue'){const at=type==='queue'?0:p;for(let i=n;i>at;i--){a[i]=a[i-1];emit(`将下标 ${i-1} 的元素右移至 ${i}。`,[i-1,i],2);}a[at]=value;}else{locate();emit(type==='stack'?'写入 *top，再将 top 向后移动。':'创建节点，连接前驱与后继；更新头尾指针。',[],2);a.splice(type==='stack'?n:p,0,value);}emit(`已插入 ${value}，长度更新为 ${a.length}。`,[type==='stack'?n:type==='queue'?0:p],3);}
 else if(op==='delete'){locate();emit(`移除 ${a[p]}。`,[p],2);if(type==='sequence'){for(let i=p;i<n-1;i++){a[i]=a[i+1];emit(`将下标 ${i+1} 的元素左移至 ${i}。`,[i,i+1],2);}a.pop();}else a.splice(p,1);emit('删除完成，更新长度与连接关系。',[],3);}
 else if(op==='modify'||op==='get'){locate();if(op==='modify')a[p]=value;emit(op==='get'?`读取结果：${a[p]}。`:`写入新值 ${value}。`,[p],3);}
 else if(op==='search'){let found=false;for(let i=0;i<n;i++){emit(`比较 ${a[i]} 与 ${value}。`,[i],1);if(a[i]===value){emit(`找到首个匹配元素，位置为 ${i+1}。`,[i],3);found=true;break;}}if(!found)emit('搜索结束，没有匹配元素。',[],3);}
 else if(op==='reverse'){if(type==='sequence'){for(let i=0;i<Math.floor(n/2);i++){[a[i],a[n-1-i]]=[a[n-1-i],a[i]];emit(`交换位置 ${i+1} 与 ${n-i}。`,[i,n-1-i],2);}}else{for(let i=0;i<n;i++)emit(type==='doubly'?`节点 ${a[i]}：交换 prev 与 next。`:`节点 ${a[i]}：保存 next，将 next 改指向 prev。`,[i],2);a.reverse();}emit('反转完成，更新头指针 / 头尾指针。',[],3);}
 else{const ids=Array.from({length:n},(_,i)=>i);if(op==='backward'||type==='stack')ids.reverse();const out=[];for(const i of ids){out.push(a[i]);emit(`访问第 ${i+1} 个元素：${a[i]}。`,[i],1,out);}emit('遍历完成。',[],3,out);}
 return frames;
}
