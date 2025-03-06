import { useState } from "react";
import { nanoid } from "nanoid";
import AddressBar from "@/components/browser/address-bar";
import Navigation from "@/components/browser/navigation";
import ContentView from "@/components/browser/content-view";
import Tab, { type Tab as TabType } from "@/components/browser/tab";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Browser() {
  const [tabs, setTabs] = useState<TabType[]>([
    { id: nanoid(), url: "", loading: false, error: null }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);

  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  const addNewTab = () => {
    const newTab: TabType = {
      id: nanoid(),
      url: "",
      loading: false,
      error: null
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) {
      // Don't close the last tab, reset it instead
      setTabs([{ id: nanoid(), url: "", loading: false, error: null }]);
      return;
    }

    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);

    // If we're closing the active tab, activate the previous tab
    if (tabId === activeTabId) {
      const closedTabIndex = tabs.findIndex(tab => tab.id === tabId);
      const newActiveTab = newTabs[closedTabIndex - 1] || newTabs[0];
      setActiveTabId(newActiveTab.id);
    }
  };

  const handleNavigate = async (newUrl: string) => {
    try {
      setTabs(tabs.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, loading: true, error: null }
          : tab
      ));

      // Validate URL format
      let targetUrl = newUrl.trim();
      if (!targetUrl.match(/^https?:\/\//)) {
        targetUrl = `https://${targetUrl}`;
      }

      // Update the current tab's URL
      setTabs(tabs.map(tab =>
        tab.id === activeTabId
          ? { ...tab, url: targetUrl }
          : tab
      ));

      // Add a small delay to ensure the loading state is visible
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error('Navigation error:', err);
      setTabs(tabs.map(tab =>
        tab.id === activeTabId
          ? { ...tab, error: 'Failed to load the requested page. Note that some websites may block proxy access.' }
          : tab
      ));
    } finally {
      setTabs(tabs.map(tab =>
        tab.id === activeTabId
          ? { ...tab, loading: false }
          : tab
      ));
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="max-w-6xl mx-auto overflow-hidden border-2">
        <div className="p-2 space-y-2 bg-muted/30">
          <div className="flex items-center border-b border-border">
            <div className="flex-1 flex">
              {tabs.map(tab => (
                <Tab
                  key={tab.id}
                  tab={tab}
                  isActive={tab.id === activeTabId}
                  onSelect={() => setActiveTabId(tab.id)}
                  onClose={() => closeTab(tab.id)}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={addNewTab}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Navigation onNavigate={handleNavigate} />
            <div className="flex-1">
              <AddressBar url={activeTab.url} onNavigate={handleNavigate} />
            </div>
          </div>
          <Alert variant="default" className="mt-2 bg-muted/50">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <AlertDescription className="text-xs text-muted-foreground">
              Some websites may not load due to their security settings
            </AlertDescription>
          </Alert>
        </div>
        <ContentView 
          url={activeTab.url} 
          loading={activeTab.loading}
          error={activeTab.error}
          className="h-[calc(100vh-12rem)]"
        />
      </Card>
    </div>
  );
}