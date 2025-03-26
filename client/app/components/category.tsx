import Link from "next/link"
import { ILoai } from "../data";

export default function ShowCategory(props: any) {
    let category = props.category as ILoai;
    return ( 
        <li className="text-blue-500"><Link href={`/product/bycategory/${category.id}`}>{category.ten_loai}</Link></li>
    );
}

