export interface Task {

    id?:string
    title:string
    description:string
    priority: 'low' | 'medium'| 'high'
    status: 'new' | 'in_progress' | 'done'
    created_at?:string
}
