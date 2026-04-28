import type { ReactNode } from 'react';

type PageProps = {
    children: ReactNode;
    title: string;
    subtitle?: string;
};

export default function Page({ children, title, subtitle }: PageProps) {
    return (
        <div className="mx-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">{title}</h1>
                {subtitle && (
                    <p className="text-muted-foreground">{subtitle}</p>
                )}
            </div>

            {children}
        </div>
    );
}
