import * as React from "react"
import * as topNavigationStyles from "./TopNavigation.module.css";

export default function TopNavigation() {
    return (
        <ul className={topNavigationStyles.navBar}>
            <li><a href="https://google.com" target="__blank">Blog</a></li>
            <li><a href="about">About</a></li>
        </ul>
    );
}