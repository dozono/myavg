declare module "*.vue" {
    import { Component } from 'vue'
    const component: Component
    export default component
}

declare module "*.png" {
    const url: string
    export default url
}


declare module "*.jpg" {
    const url: string
    export default url
}


declare module "*raw" {
    const content: string
    export default content
}
