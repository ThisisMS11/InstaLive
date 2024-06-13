import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { View, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';


const Stats = [
    {
        symbol: <Eye />,
        label: "Total Views",
        No: "28,0700",
    },
    {
        symbol: <View />,
        label: "Current Viewers",
        No: "15,780",
    },
    {
        symbol: <ThumbsUp />,
        label: "Likes",
        No: "1890",
    },
    {
        symbol: <ThumbsDown />,
        label: "Dislikes",
        No: "149",
    },

]

export default function StatTable() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead >Stat</TableHead>
                    <TableHead >Label</TableHead>
                    <TableHead>No.</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Stats.map((stat, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{stat.symbol}</TableCell>
                        <TableCell className="font-medium">{stat.label}</TableCell>
                        <TableCell>{stat.No}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            {/* <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
            </TableFooter> */}
        </Table>
    )
}
