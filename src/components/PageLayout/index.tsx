import React, { Fragment, Component, ComponentType } from 'react';
import { ChevronRight, Home } from 'lucide-react';
export interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: ComponentType<{
        className?: string;
    }>;
    current?: boolean;
}
interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    'data-id'?: string;
}
export function Breadcrumbs({ items, 'data-id': dataId }: BreadcrumbsProps) {
    return (
        <nav
            className="flex items-center gap-2 text-sm"
            style={{
                whiteSpace: 'nowrap',
            }}
            aria-label="Breadcrumb"
            data-id={dataId}
        >
            {items.map((item, index) => (
                <Fragment key={index}>
                    {index > 0 && <ChevronRight className="w-3 h-3 text-gray-400" />}
                    {item.current ? (
                        <span className="text-gray-900 font-medium flex items-center">
                            {index === 0 && <Home className="w-4 h-4 text-gray-400 mr-1" />}
                            {item.label}
                        </span>
                    ) : (
                        <a
                            href={item.href || '#'}
                            className="text-gray-600 hover:text-gray-800 flex items-center"
                        >
                            {index === 0 && <Home className="w-4 h-4 text-gray-400 mr-1" />}
                            {item.label}
                        </a>
                    )}
                </Fragment>
            ))}
        </nav>
    );
}
interface PageHeaderProps {
    title: string;
    breadcrumbs?: BreadcrumbItem[];
    'data-id'?: string;
}
export function PageHeader({
    title,
    breadcrumbs,
    'data-id': dataId,
}: PageHeaderProps) {
    return (
        <div className="pb-4 mb-6" data-id={dataId}>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumbs items={breadcrumbs} />
            )}
        </div>
    );
}
interface PageLayoutProps {
    title?: string;
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
    'data-id'?: string;
}
export function PageLayout({
    title,
    breadcrumbs,
    children,
    'data-id': dataId,
}: PageLayoutProps) {
    return (
        <main
            className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50"
            data-id={dataId}
        >
            {title && <PageHeader title={title} breadcrumbs={breadcrumbs} />}
            <div className="space-y-6">{children}</div>
        </main>
    );
}
interface PageSectionProps {
    children: React.ReactNode;
    className?: string;
    'data-id'?: string;
}
export function PageSection({
    children,
    className = '',
    'data-id': dataId,
}: PageSectionProps) {
    return (
        <div
            className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
            data-id={dataId}
        >
            {children}
        </div>
    );
}
interface SectionHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    'data-id'?: string;
    children: React.ReactNode;
}
export function SectionHeader({
    title,
    description,
    actions,
    'data-id': dataId,
    children
}: SectionHeaderProps) {
    return (
        <>
            {children}
        </>
    );
}
interface SectionContentProps {
    children: React.ReactNode;
    className?: string;
    'data-id'?: string;
}
export function SectionContent({
    children,
    className = '',
    'data-id': dataId,
}: SectionContentProps) {
    return (
        <div className={`p-6 ${className}`} data-id={dataId}>
            {children}
        </div>
    );
}
interface PrimaryButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    'data-id'?: string;
}
export function PrimaryButton({
    children,
    onClick,
    disabled = false,
    type = 'button',
    className = '',
    'data-id': dataId,
}: PrimaryButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md
        text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
        ${className}
      `}
            data-id={dataId}
        >
            {children}
        </button>
    );
}
interface SecondaryButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    'data-id'?: string;
}
export function SecondaryButton({
    children,
    onClick,
    disabled = false,
    type = 'button',
    className = '',
    'data-id': dataId,
}: SecondaryButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md
        text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
        ${className}
      `}
            data-id={dataId}
        >
            {children}
        </button>
    );
}
