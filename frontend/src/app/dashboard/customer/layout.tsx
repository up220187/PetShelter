export default function Layout (
    {children}
    : {children: React.ReactNode}){
        return (
            <section>
                Layout del dashboard
                {children}
            </section>
        )
    }