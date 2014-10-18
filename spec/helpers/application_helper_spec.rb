require 'spec_helper'

describe ApplicationHelper do

  context 'alert_for' do

    it 'should create an alert with the default class' do
      alert = alert_for('Test alert')
      expect(alert).to eq('<div class="alert alert-info"><button class="close" data-dismiss="alert">x</button><span><i class="icon-warning-sign" style="margin-right: 1em;"></i>Test alert</span></div>')
    end

    it 'should create an alert with the danger class' do
      alert = alert_for('Test alert', class: 'alert-danger')
      expect(alert).to eq('<div class="alert alert-danger"><button class="close" data-dismiss="alert">x</button><span><i class="icon-warning-sign" style="margin-right: 1em;"></i>Test alert</span></div>')
    end

  end

  context 'flash_messages' do

    context 'flash error' do
      it 'should have flash error' do
        flash[:error] = 'error message'
        expect(flash_messages).to eq("<div class=\"alert alert-danger\"><button class=\"close\" data-dismiss=\"alert\">x</button><span><i class=\"icon-warning-sign\" style=\"margin-right: 1em;\"></i>error message</span></div>".html_safe)
      end
    end

    context 'flash notice' do
      it 'should have notice alert' do
        flash[:notice] = 'notice message'
        expect(flash_messages).to eq("<div class=\"alert alert-info\"><button class=\"close\" data-dismiss=\"alert\">x</button><span><i class=\"icon-warning-sign\" style=\"margin-right: 1em;\"></i>notice message</span></div>".html_safe)
      end
    end

  end

end
