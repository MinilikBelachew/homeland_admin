declare module '@daypilot/daypilot-lite-react' {
    export namespace DayPilot {
      class Calendar {
        events: {
          update(e: any): void;
          remove(e: any): void;
          add(e: any): void;
        };
        clearSelection(): void;
        update(config: any): void;
        disposed(): boolean;
      }
  
      class Event {
        data: any;
      }
  
      class Modal {
        static prompt(message: string, defaultValue?: string): Promise<{ result: string; canceled: boolean }>;
        static form(form: any, data: any): Promise<{ result: any; canceled: boolean }>;
      }
  
      class Menu {
        constructor(config: any);
      }
  
      class guid {
        static newGuid(): string;
      }
  
      interface CalendarConfig {
        viewType: string;
        durationBarVisible: boolean;
        onTimeRangeSelected?: (args: any) => void;
        onEventClick?: (args: any) => void;
        contextMenu?: any;
        onBeforeEventRender?: (args: any) => void;
      }
  
      interface CalendarBeforeEventRenderArgs {
        data: any;
      }
  
      interface CalendarTimeRangeSelectedArgs {
        start: string;
        end: string;
      }
  
      interface EventData {
        id: number | string;
        text: string;
        start: string;
        end: string;
        backColor?: string;
        tags: {
          participants: number;
        };
      }
    }
  
    export const DayPilotCalendar: any;
  }
  