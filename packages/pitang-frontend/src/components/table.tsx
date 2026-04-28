import {
    Table as TableBase,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { ReactNode } from 'react';

type TableProps = {
    caption: string;
    columns: {
        id: string;
        title: string;
        render?: (item: any, row: any) => ReactNode;
    }[];
    rows: any[];
};

export default function Table(props: TableProps) {
    return (
        <TableBase>
            <TableCaption>{props.caption}</TableCaption>

            <TableHeader>
                <TableRow>
                    {props.columns.map((column, index) => (
                        <TableHead key={index}>{column.title}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            <TableBody>
                {props.rows.map((row, index) => (
                    <TableRow key={index}>
                        {props.columns.map((column, index) => {
                            const value = row[column.id];

                            const renderValue = column.render
                                ? column.render(value, row)
                                : value;

                            return (
                                <TableHead key={index}>{renderValue}</TableHead>
                            );
                        })}
                    </TableRow>
                ))}
            </TableBody>
        </TableBase>
    );
}
